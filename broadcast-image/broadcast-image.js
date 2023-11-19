async function onBroadcastImageAsync() {
    document.getElementById("invalid-state").classList.add("d-none");

    const inputUrl = document.getElementById("input-image").value;
    var validationResult = await validateImageAsync(inputUrl);

    if (validationResult.isValid) {
        TS.sync.send(inputUrl, "board");
    }
    else {
        setInvalidState(validationResult.message);
    }
}

async function handleSyncEvents(event) {
    document.getElementById("broadcasted-image").src = event.payload.str;
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

    if (url.length > 400) {
        validationResult.message = `The link must be 400 characters or less. Current link has ${url.length} characters.`;
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

function reset() {
    document.getElementById("input-image").value = "";
    document.getElementById("broadcasted-image").src = "";
    document.getElementById("invalid-state").classList.add("d-none");
}

function setInvalidState(validationMessage) {
    document.getElementById("invalid-state").classList.remove("d-none");
    document.getElementById("broadcasted-image").src = "";
    document.getElementById("invalid-state-message").innerHTML = validationMessage;
}