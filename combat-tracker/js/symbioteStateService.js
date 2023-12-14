import Effect from "./effect.js";
import AddCustomEffectForm from './addCustomEffectForm.js';

let form;

document.querySelector("#button-add-custom-condition").addEventListener("click", function (e) {
    form = new AddCustomEffectForm();
});

document.addEventListener("click", function (e) {
    const target = e.target.closest("#submit-custom-condition-form");

    if (target) {
        form.submit();
    }
});

document.addEventListener("click", function (e) {
    const target = e.target.closest("#cancel-custom-condition-form");

    if (target) {
        form.cancel();
    }
});


async function loadStoredDataAsync() {
    let storedData = await TS.localStorage.campaign.getBlob();
    let data = JSON.parse(storedData || "{}");

    for (let [key, value] of Object.entries(data)) {
        if (key == "effects") {
            value.forEach(effect => {
                Effect.addCustomEffect(effect.name, effect.roundDuration);
            });
        }
    }
}

async function onStateChangeEventAsync(msg) {
    if (msg.kind === "hasInitialized") {
        loadStoredDataAsync();
    }
}

export default {
    onStateChangeEventAsync
};