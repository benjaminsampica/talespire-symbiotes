async function onBroadcastImageAsync() {
    document.getElementById("invalid-state").classList.add("d-none");

    let inputUrl = document.getElementById("input-image").value;
    IsValidImage(inputUrl, (isValid) => {
        if (isValid) {
            TS.sync.send(inputUrl, "board");
        }
    });
}

async function handleSyncEvents(event) {
    document.getElementById("broadcasted-image").src = event.payload.str;
}

function IsValidImage(url, callback) {
    var img = new Image();

    img.onload = () => {
        if (url.length <= 400) {
            callback(true);
        }
        else {
            callback(false);
        }
    };

    img.onerror = () => {
        callback(false);
        setInvalidState();
    };

    img.src = url;
}

function reset() {
    document.getElementById("input-image").value = "";
}

function setInvalidState() {
    document.getElementById("invalid-state").classList.remove("d-none");
    document.getElementById("broadcasted-image").src = "";
}