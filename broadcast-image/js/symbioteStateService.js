import ReceivedImagesState from './receivedImagesState.js';

const receivedImagesState = new ReceivedImagesState(addImageToCampaignStorage, removeImageFromCampaignStorage);

async function addImageToCampaignStorage(image)
{
    TS.localStorage.campaign
        .getBlob()
        .then((storedData) => {
            let newStoredData = JSON.parse(storedData || "{}");
            if (newStoredData.images == undefined) {
                newStoredData.images = [image];
            } else {
                if(newStoredData.images.length >= 50)
                {
                    newStoredData.images.shift();
                }

                newStoredData.images.push(image);
            }

            TS.localStorage.campaign.setBlob(JSON.stringify(newStoredData));
        });
}

async function removeImageFromCampaignStorage(id)
{
    TS.localStorage.campaign
        .getBlob()
        .then((storedData) => {
            let newStoredData = JSON.parse(storedData || "{}");
            newStoredData.images =  newStoredData.images.filter(i => i.id.toString() !== id.toString());

            TS.localStorage.campaign.setBlob(JSON.stringify(newStoredData));
        });
}

async function loadStoredDataAsync() {
    let storedData = await TS.localStorage.campaign.getBlob();
    let data = JSON.parse(storedData || "{}");

    for (let [key, value] of Object.entries(data)) {
        if (key == "images") {
            receivedImagesState.initializeReceivedImages(value);
        }
    }
}

async function onStateChangeEventAsync(msg) {
    if (msg.kind === "hasInitialized") {
        loadStoredDataAsync();
    }
}

export default {
    receivedImagesState
}

window.onStateChangeEventAsync = onStateChangeEventAsync;