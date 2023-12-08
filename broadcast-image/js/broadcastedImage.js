import ImagePart from "./imagePart.js";

export default class BroadcastedImage {
    constructor(url) {
        this.id = Math.floor((Math.random() * 100_000_000) + 1);
        this.url = url;
    }

    getParts() {
        const taleSpireMaxLength = 350;
        const partCount = Math.ceil(this.url.length / taleSpireMaxLength);

        const imageParts = [];
        for (let i = 0, o = 0; i <= partCount - 1; ++i, o += taleSpireMaxLength) {
            imageParts[i] = new ImagePart(this.id, this.url.substr(o, taleSpireMaxLength), i == partCount - 1);
        }

        return imageParts;
    }

    async validateAsync() {
        const validationResult = {
            message: ``,
            isValid: false
        }

        if (this.url.length <= 0) {
            validationResult.message = `Please provide a link to an image.`
            return validationResult;
        }

        const isImage = await this.loadImageAsync();

        if (!isImage) {
            validationResult.message = `Could not interpret the given link as an image.`
        }

        validationResult.isValid = isImage;

        return validationResult;
    }

    async loadImageAsync() {
        const image = new Image();
        image.src = this.url;
        const isImage = await new Promise(resolve => {
            image.onload = () => resolve(true);
            image.onerror = () => resolve(false);
        });

        return isImage;
    }
}