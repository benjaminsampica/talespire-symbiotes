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

    getImageUrls() {
        let imageUrls = [];
        this.receivedImageParts.reduce(
            (entryMap, ric) => entryMap.set(ric.id, [...entryMap.get(ric.id) || [], ric]),
            new Map()
        ).forEach(gb => {
            let imageUrl = this.buildImageUrlFromParts(gb[0].id);
            imageUrls.push(imageUrl);
        });

        return imageUrls;
    }
}