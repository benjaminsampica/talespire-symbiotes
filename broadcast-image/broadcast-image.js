let receivedImageChunks = [];

async function onBroadcastImageAsync() {
    document.getElementById("invalid-state").classList.add("d-none");

    const inputUrl = document.getElementById("input-image").value;
    var validationResult = await validateImageAsync(inputUrl);

    if (validationResult.isValid) {
        let imageChunks = getImageUrlChunks(inputUrl);

        imageChunks.forEach(async (chunk, index) => {
            await new Promise(resolve => setTimeout(resolve, 75 * index));  // Sleep to avoid rate limiting.

            TS.sync.send(JSON.stringify(chunk), "board");
        });

    }
    else {
        setInvalidState(validationResult.message);
    }
}

function handleSyncEvents(event) {
    let imageChunk = JSON.parse(event.payload.str);
    receivedImageChunks.push(imageChunk);

    document.getElementById("loading").classList.remove("d-none");

    if (imageChunk.isLastChunk) {
        var imageUrl = receivedImageChunks
            .filter(ric => ric.id == imageChunk.id)
            .map(ric => ric.part)
            .join('');
        document.getElementById("broadcasted-image").src = imageUrl;
        document.getElementById("loading").classList.add("d-none");
    }
}

async function validateImageAsync(url) {
    const validationResult = {
        message: ``,
        isValid: false
    }

    if (url.length <= 0) {
        validationResult.message = `Please provide a link to an image.`
        return validationResult;
    }

    const isImage = await loadImageAsync(url);

    if (!isImage) {
        validationResult.message = `Could not interpret the given link as an image.`
    }

    validationResult.isValid = isImage;

    return validationResult;
}

async function loadImageAsync(url) {
    const image = new Image();
    image.src = url;
    const isImage = await new Promise(resolve => {
        image.onload = () => resolve(true);
        image.onerror = () => resolve(false);
    });

    return isImage;
}

function getImageUrlChunks(url) {
    const maxLength = 350;
    const chunkCount = Math.ceil(url.length / maxLength);

    const id = Math.floor((Math.random() * 100_000_000) + 1);;
    let imageParts = [];
    for (let i = 0, o = 0; i <= chunkCount - 1; ++i, o += maxLength) {
        imageParts[i] = {
            part: url.substr(o, maxLength),
            id: id,
            isLastChunk: i == chunkCount - 1
        }
    }

    return imageParts;
}

function reset() {
    document.getElementById("input-image").value = "";
    document.getElementById("broadcasted-image").src = "";
    document.getElementById("invalid-state").classList.add("d-none");
    document.getElementById("loading").classList.add("d-none");
}

function setInvalidState(validationMessage) {
    document.getElementById("invalid-state").classList.remove("d-none");
    document.getElementById("broadcasted-image").src = "";
    document.getElementById("invalid-state-message").innerHTML = validationMessage;
}