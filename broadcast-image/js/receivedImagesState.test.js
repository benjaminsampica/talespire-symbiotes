import ReceivedImagesState from './receivedImagesState.js';
import BroadcastedImage from './broadcastedImage.js';

const singlePartImageUrl = "https://www.google.com";
const multiPartImageUrl = "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/d1ec0bd0-8f09-4540-8a1a-a7942219e642/dawf7eu-db581ed6-f418-4036-b49d-29ce91b5353d.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2QxZWMwYmQwLThmMDktNDU0MC04YTFhLWE3OTQyMjE5ZTY0MlwvZGF3ZjdldS1kYjU4MWVkNi1mNDE4LTQwMzYtYjQ5ZC0yOWNlOTFiNTM1M2QucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.zgw0xZVSfwIWfkh6ZBz7cXo4qAsEudiPeWT1uvkthPk";

test("given a received image part, then adds to received image parts.", () => {
    let broadcastedImage = new BroadcastedImage(singlePartImageUrl);
    let part = broadcastedImage.getParts()[0];

    const sut = new ReceivedImagesState();

    sut.receiveImagePart(part);

    expect(sut.receivedImageParts[0]).toEqual(part);
});

test("given one image part, then rebuilds the image url.", () => {
    let broadcastedImage = new BroadcastedImage(singlePartImageUrl);
    let parts = broadcastedImage.getParts();

    const sut = new ReceivedImagesState();

    parts.forEach(p => sut.receiveImagePart(p));

    const expectedUrl = sut.buildImageUrlFromParts(parts[0].id);
    expect(expectedUrl).toEqual(singlePartImageUrl);
});

test("given multiple image parts, then rebuilds the image url.", () => {
    let broadcastedImage = new BroadcastedImage(multiPartImageUrl);
    let parts = broadcastedImage.getParts();

    const sut = new ReceivedImagesState();

    parts.forEach(p => sut.receiveImagePart(p));

    const expectedUrl = sut.buildImageUrlFromParts(parts[0].id);
    expect(expectedUrl).toEqual(multiPartImageUrl);
});

test("given multiple image parts, then rebuilds the image url.", () => {
    let broadcastedImage = new BroadcastedImage(multiPartImageUrl);
    let parts = broadcastedImage.getParts();

    const sut = new ReceivedImagesState();

    parts.forEach(p => sut.receiveImagePart(p));

    const expectedUrl = sut.getImageUrls();
    expect(expectedUrl[0]).toEqual(multiPartImageUrl);
});