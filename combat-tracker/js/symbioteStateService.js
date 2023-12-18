import Effect from "./effect.js";
import Condition from "./condition.js";
import AddCustomEffectForm from './addCustomEffectForm.js';
import RemoveCustomEffectForm from "./removeCustomEffectForm.js";
import AddCustomConditionForm from './addCustomConditionForm.js';
import RemoveCustomConditionForm from './removeCustomConditionForm.js';

let form;

document.querySelector("#button-add-custom-effect").addEventListener("click", function (e) {
    form = new AddCustomEffectForm(addEffectToCampaignStorage);
});

document.addEventListener("click", function (e) {
    const target = e.target.closest("#submit-add-custom-effect-form");

    if (target) {
        form.submit();
    }
});

document.addEventListener("click", function (e) {
    const target = e.target.closest("#cancel-add-custom-effect-form");

    if (target) {
        form.cancel();
    }
});

async function addEffectToCampaignStorage(effect)
{
    TS.localStorage.campaign
        .getBlob()
        .then((storedData) => {
            let newStoredData = JSON.parse(storedData || "{}");
            if (newStoredData.effects == undefined) {
                newStoredData.effects = [effect];
            } else {
                newStoredData.effects.push(effect);
            }

            TS.localStorage.campaign.setBlob(JSON.stringify(newStoredData));
        });
}

document.querySelector("#button-remove-custom-effect").addEventListener("click", function (e) {
    form = new RemoveCustomEffectForm(removeEffectFromCampaignStorage);
});

document.addEventListener("click", function (e) {
    const target = e.target.closest("#submit-remove-custom-effect-form");

    if (target) {
        form.submit();
    }
});

document.addEventListener("click", function (e) {
    const target = e.target.closest("#cancel-remove-custom-effect-form");

    if (target) {
        form.cancel();
    }
});

async function removeEffectFromCampaignStorage(name)
{
    TS.localStorage.campaign
        .getBlob()
        .then((storedData) => {
            let newStoredData = JSON.parse(storedData);
            
            newStoredData.effects = newStoredData.effects.filter(e => e.name !== name)

            TS.localStorage.campaign.setBlob(JSON.stringify(newStoredData));
        });
}


document.querySelector("#button-add-custom-condition").addEventListener("click", function (e) {
    form = new AddCustomConditionForm(addConditionToCampaignStorage);
});

document.addEventListener("click", function (e) {
    const target = e.target.closest("#submit-add-custom-condition-form");

    if (target) {
        form.submit();
    }
});

document.addEventListener("click", function (e) {
    const target = e.target.closest("#cancel-add-custom-condition-form");

    if (target) {
        form.cancel();
    }
});

async function addConditionToCampaignStorage(condition)
{
    TS.localStorage.campaign
        .getBlob()
        .then((storedData) => {
            let newStoredData = JSON.parse(storedData || "{}");
            if (newStoredData.conditions == undefined) {
                newStoredData.conditions = [condition];
            } else {
                newStoredData.conditions.push(condition);
            }

            TS.localStorage.campaign.setBlob(JSON.stringify(newStoredData));
        });
}

document.querySelector("#button-remove-custom-condition").addEventListener("click", function (e) {
    form = new RemoveCustomConditionForm(removeConditionFromCampaignStorage);
});

document.addEventListener("click", function (e) {
    const target = e.target.closest("#submit-remove-custom-condition-form");

    if (target) {
        form.submit();
    }
});

document.addEventListener("click", function (e) {
    const target = e.target.closest("#cancel-remove-custom-condition-form");

    if (target) {
        form.cancel();
    }
});

async function removeConditionFromCampaignStorage(name)
{
    TS.localStorage.campaign
        .getBlob()
        .then((storedData) => {
            let newStoredData = JSON.parse(storedData);
            
            newStoredData.conditions = newStoredData.conditions.filter(e => e.name !== name)

            TS.localStorage.campaign.setBlob(JSON.stringify(newStoredData));
        });
}

async function loadStoredDataAsync() {
    let storedData = await TS.localStorage.campaign.getBlob();
    let data = JSON.parse(storedData || "{}");

    for (let [key, value] of Object.entries(data)) {
        if (key == "effects") {
            value.forEach(effect => {
                Effect.addCustomEffect(effect.name, effect.roundDuration);
            });
        }
        if (key == "conditions") {
            value.forEach(condition => {
                Condition.addCustomCondition(condition.name);
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