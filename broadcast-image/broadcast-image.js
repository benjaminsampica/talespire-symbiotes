async function onBroadcastImageAsync() {
    document.getElementById("invalid-state").classList.add("d-none");

    let inputUrl = document.getElementById("input-image").value;
    isImage(inputUrl, (isValid) => {
        if (isValid) {
            document.getElementById("broadcasted-image").src = inputUrl;
            TS.sync.send(inputUrl);
        }
    });
}

function onSyncMessage(syncMessageReceived) {
    document.getElementById("broadcasted-image").src = syncMessageReceived.message;
}

function isImage(url, callback) {
    var img = new Image();
    img.onload = () => {
        callback(true);
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