async function onBroadcastImageAsync()
{
    document.getElementById("invalid-state").classList.add("d-none");

    var inputUrl = document.getElementById("input-image").value;
    var isValidUrl = isValidUrl();

    if(!isValidUrl)
    {
        document.getElementById("invalid-state").classList.remove("d-none");
        return;
    }

    document.getElementById("broadcasted-image").src = inputUrl;

    TS.sync.send(inputUrl);
}

function onSyncMessage(syncMessageReceived)
{
    document.getElementById("broadcasted-image").src = syncMessageReceived.message;
}