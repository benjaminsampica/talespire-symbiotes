import BroadcastedImage from './broadcastedImage.js';

export default class BroadcastImageTab {
    constructor(receivedImagesState) {
        this.receivedImagesState = receivedImagesState;
    }

    async onBroadcastImageAsync() {
        document.getElementById("invalid-state").classList.add("d-none");

        const inputUrl = document.getElementById("input-image").value;
        const broadcastImage = new BroadcastedImage(inputUrl);
        var validationResult = await broadcastImage.validateAsync();

        if (validationResult.isValid) {
            broadcastImage.getParts().forEach(async (imagePart, index) => {
                await new Promise(resolve => setTimeout(resolve, 75 * index));  // Sleep to avoid rate limiting.

                TS.sync.send(JSON.stringify(imagePart), "board");
            });

        }
        else {
            this.setInvalidState(validationResult.message);
        }
    }

    setImageUrl(broadcastedImageId) {
        const url = this.receivedImagesState.images.filter(i => i.id.toString() === broadcastedImageId)[0].url;

        document.getElementById("input-image").value = url;
    }

    show() {
        document.getElementById("button-broadcast-image-tab").classList.add("active");
        document.getElementById("broadcast-image-tab").classList.remove("d-none");
    }

    hide() {
        document.getElementById("button-broadcast-image-tab").classList.remove("active");
        document.getElementById("broadcast-image-tab").classList.add("d-none");
    }

    reset() {
        document.getElementById("input-image").value = "";
        document.getElementById("broadcasted-image").src = "";
        document.getElementById("invalid-state").classList.add("d-none");
        document.getElementById("loading").classList.add("d-none");
    }

    setInvalidState(validationMessage) {
        document.getElementById("invalid-state").classList.remove("d-none");
        document.getElementById("broadcasted-image").src = "";
        document.getElementById("invalid-state-message").innerHTML = validationMessage;
    }
}

