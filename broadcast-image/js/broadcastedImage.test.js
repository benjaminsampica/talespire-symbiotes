import BroadcastedImage from "./broadcastedImage.js";
import { jest } from '@jest/globals';

const multiPartImageUrl = "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/d1ec0bd0-8f09-4540-8a1a-a7942219e642/dawf7eu-db581ed6-f418-4036-b49d-29ce91b5353d.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2QxZWMwYmQwLThmMDktNDU0MC04YTFhLWE3OTQyMjE5ZTY0MlwvZGF3ZjdldS1kYjU4MWVkNi1mNDE4LTQwMzYtYjQ5ZC0yOWNlOTFiNTM1M2QucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.zgw0xZVSfwIWfkh6ZBz7cXo4qAsEudiPeWT1uvkthPk";

test("when constructed, then sets image parts.", () => {
    const sut = new BroadcastedImage(multiPartImageUrl);

    expect(sut.getParts().length).toBeGreaterThan(0);
});

test("when url length is empty, then is not valid", async () => {
    const sut = new BroadcastedImage("");

    var result = await sut.validateAsync();

    expect(result.isValid).toBe(false);
});

test("when image is not a valid image, then is not valid", async () => {
    const sut = new BroadcastedImage(multiPartImageUrl);

    jest.spyOn(sut, 'loadImageAsync')
        .mockImplementation(() => false);

    var result = await sut.validateAsync();

    expect(result.isValid).toBe(false);
});

test("when image is a valid image, then is valid", async () => {
    const sut = new BroadcastedImage(multiPartImageUrl);

    jest.spyOn(sut, 'loadImageAsync')
        .mockImplementation(() => true);

    var result = await sut.validateAsync();

    expect(result.isValid).toBe(true);
});