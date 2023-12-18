import ReceivedImagesState from "./receivedImagesState.js";

async function addImageToCampaignStorage(image)
{
    TS.localStorage.campaign
        .getBlob()
        .then((storedData) => {
            let newStoredData = JSON.parse(storedData || "{}");
            if (newStoredData.images == undefined) {
                newStoredData.effects = [image];
            } else {
                newStoredData.images.push(image);
            }

            TS.localStorage.campaign.setBlob(JSON.stringify(newStoredData));
        });
}


async function loadStoredDataAsync() {
    let storedData = await TS.localStorage.campaign.getBlob();
    let data = JSON.parse(storedData || "{}");

    for (let [key, value] of Object.entries(data)) {
        if (key == "images") {
            value.forEach(image => {
                ReceivedImagesState.(image);
            });
        }
    }
}

async function onStateChangeEventAsync(msg) {
    if (msg.kind === "hasInitialized") {
        loadStoredDataAsync();
    }
}

window.onStateChangeEventAsync = onStateChangeEventAsync;