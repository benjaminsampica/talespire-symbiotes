export default class ImageHistoryTab {
    constructor(receivedImagesState) {
        this.receivedImagesState = receivedImagesState;
    }

    show() {
        document.getElementById("button-image-history-tab").classList.add("active");

        const tabElement = document.getElementById("image-history-tab");
        tabElement.innerHTML = this.buildHtml();
        tabElement.classList.remove("d-none");
    }

    hide() {
        document.getElementById("button-image-history-tab").classList.remove("active");
        document.getElementById("image-history-tab").classList.add("d-none");
    }

    buildHtml() {
        const images = this.receivedImagesState.getUniqueImages();

        let html = '<div class="row">';
        images.forEach(img => {
            html += `
                <div class="col-6 center">
                    <img src="${img.url}" class="historical-image" />
                    <div class="row">
                        <button id="button-rebroadcast" data-id="${img.id}">Rebroadcast</button>
                    </div>
                </div>
            `
        });
        html += '<div>';

        return html;
    }
}