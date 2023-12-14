import Effect from './effect.js';
import InvalidStateService from './invalidStateService.js';

export default class addCustomEffectForm {
    constructor() {
        this.initialize();
    }

    initialize() {
        let html = `
            <h3>Add A Custom Condition</h3>
            Name
            <input id='custom-condition-name' class='w-100' required placeholder='Bless'/>
            Number of Rounds
            <input id='custom-condition-rounds' class='w-100' required type='number' min='1' step='1' value='10'/>
        `;

        html += `
            <button id='submit-custom-condition-form' class='mt-1'>Add</button>
            <button id='cancel-custom-condition-form' class='mt-1'>Cancel</button>
        `

        document.getElementById('form').innerHTML = html;
    }

    submit() {
        let name = document.getElementById('custom-condition-name').value;
        let roundDuration = document.getElementById('custom-condition-rounds').value;
        if (name.trim().length === 0 || roundDuration <= 0) {
            InvalidStateService.setInvalidState("Please choose a name and number of rounds.");
        }
        else {
            const effect = Effect.addCustomEffect(name, roundDuration);

            TS.localStorage.campaign.getBlob()
                .then((storedData) => {
                    let newStoredData = JSON.parse(storedData || "{}");
                    if (newStoredData.effects == undefined) {
                        newStoredData.effects = [effect];
                    } else {
                        newStoredData.effects.push(effect);
                    }

                    TS.localStorage.campaign.setBlob(JSON.stringify(newStoredData));
                });

            document.getElementById('form').innerHTML = '';
            InvalidStateService.resetInvalidState();
        }
    }

    cancel() {
        document.getElementById('form').innerHTML = '';
        InvalidStateService.resetInvalidState();
    }
}