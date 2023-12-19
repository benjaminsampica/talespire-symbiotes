import ReceivedImage from "./receivedImage.js";

export default class ReceivedImagesState {
    constructor(onImageAddedCallback, onImageRemovedCallback) {
        this.imageParts = [];
        this.onImageAddedCallback = onImageAddedCallback;
        this.onImageRemovedCallback = onImageRemovedCallback;
        this.images = []
    }

    receiveImagePart(imagePart) {
        this.imageParts.push(imagePart);
    }

    createImageFromParts(broadcastedImageId) {
        let url = "";
        this.imageParts
            .filter(ric => ric.id == broadcastedImageId)
            .forEach(ip => {
                url += ip.imagePart;
            });
        this.imageParts = [];

        const existingImage = this.images.find(i => i.url === url);
        if(existingImage !== null && existingImage !== undefined) 
            return existingImage;
        
        const receivedImage = new ReceivedImage(broadcastedImageId, url);
        this.onImageAddedCallback(receivedImage);
        this.images.push(receivedImage);
        return receivedImage;
    }

    initializeReceivedImages(images) {
        this.images = images;
    }

    removeImage(id) {
        this.images = this.images.filter(i => i.id.toString() !== id);
        this.imageParts = this.imageParts.filter(ip => ip.id.toString() !== id);

        this.onImageRemovedCallback(id);
    }
}