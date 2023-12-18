import ReceivedImage from "./receivedImage.js";

export default class ReceivedImagesState {
    constructor() {
        this.receivedImageParts = [];
    }

    receiveImagePart(imagePart) {
        this.receivedImageParts.push(imagePart);
    }

    buildImageUrlFromParts(broadcastedImageId) {
        return this.receivedImageParts
            .filter(ric => ric.id == broadcastedImageId)
            .map(ric => ric.imagePart)
            .join('');
    }

    getUniqueImages() {
        const receivedImages = [];
        this.receivedImageParts.reduce(
            (entryMap, rip) => entryMap.set(rip.id, [...entryMap.get(rip.id) || [], rip]),
            new Map()
        ).forEach(gb => {
            const id = gb[0].id;
            const imageUrl = this.buildImageUrlFromParts(id);
            receivedImages.push(new ReceivedImage(id, imageUrl));
        });

        return receivedImages;
    }

    removeImage(id)
    {
        this.receivedImageParts = this.receivedImageParts.filter(rip => rip.id.toString() !== id);
    }
}