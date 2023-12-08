import BroadcastImageTab from './broadcastImageTab.js';
import ImageHistoryTab from './imageHistoryTab.js';
import ReceivedImagesState from './receivedImagesState.js';

const receivedImagesState = new ReceivedImagesState();
const imageHistoryTab = new ImageHistoryTab(receivedImagesState);
const broadcastImageTab = new BroadcastImageTab(receivedImagesState);

document.querySelector("#button-reset-form").addEventListener("click", function (e) {
    broadcastImageTab.reset();
});

document.querySelector("#button-broadcast-image").addEventListener("click", function (e) {
    broadcastImageTab.onBroadcastImageAsync();
});

document.querySelector("#button-broadcast-image-tab").addEventListener("click", function (e) {
    broadcastImageTab.show();
    imageHistoryTab.hide();
});

document.querySelector("#button-image-history-tab").addEventListener("click", function (e) {
    imageHistoryTab.show();
    broadcastImageTab.hide();
});

document.addEventListener("click", function (e) {
    const target = e.target.closest("#button-rebroadcast");

    if (target) {
        imageHistoryTab.hide();
        broadcastImageTab.reset();
        broadcastImageTab.setImageUrl(target.dataset.id);
        broadcastImageTab.show();
    }
});

window.handleSyncEvents = function handleSyncEvents(event) {
    let imagePart = JSON.parse(event.payload.str);
    receivedImagesState.receiveImagePart(imagePart);

    broadcastImageTab.show();
    imageHistoryTab.hide();

    document.getElementById("loading").classList.remove("d-none");

    if (imagePart.isLastPart) {
        document.getElementById("broadcasted-image").src = receivedImagesState.buildImageUrlFromParts(imagePart.id);
        document.getElementById("loading").classList.add("d-none");
    }
}