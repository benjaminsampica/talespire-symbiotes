async function onBroadcastImageAsync() {
    document.getElementById("invalid-state").classList.add("d-none");

    isImage(document.getElementById("input-image").value, (isValid) => {
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

function setInvalidState() {
    document.getElementById("invalid-state").classList.remove("d-none");
}