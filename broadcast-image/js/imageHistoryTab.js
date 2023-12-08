export default class ImageHistoryTab {
    constructor(receivedImagesState) {
        this.receivedImagesState = receivedImagesState;
    }

    show() {
        var element = document.getElementById("image-history-tab");

        element.innerHTML = this.buildHtml();

        element.classList.remove("d-none");
    }

    hide() {
        document.getElementById("image-history-tab").classList.add("d-none");
    }

    buildHtml() {
        const imageUrls = this.receivedImagesState.getImageUrls();

        let html = '<div>';
        imageUrls.forEach(url => {
            html += `<img src="${url}" width=60 height=60 />`;
        });
        html += '<div>';

        return html;
    }
}