import Effect from './effect.js';
import InvalidStateService from './invalidStateService.js';

export default class addCustomEffectForm {
    constructor(onSubmitFormCallback) {
        this.onSubmitFormCallback = onSubmitFormCallback;
        this.initialize();
    }

    initialize() {
        let html = `
            <h3>Add A Custom Effect</h3>
            Name
            <input id='custom-effect-name' class='w-100' required placeholder='Bless'/>
            Number of Rounds
            <input id='custom-effect-rounds' class='w-100' required type='number' min='1' value='10'/>
        `;

        html += `
            <button id='submit-add-custom-effect-form' class='mt-1'>Add</button>
            <button id='cancel-add-custom-effect-form' class='mt-1'>Cancel</button>
        `

        document.getElementById('form').innerHTML = html;
    }

    submit() {
        let name = document.getElementById('custom-effect-name').value;
        let roundDuration = document.getElementById('custom-effect-rounds').value;
        if (name.trim().length === 0 || roundDuration <= 0) {
            InvalidStateService.setInvalidState("Please choose a name and number of rounds.");
        }
        else {
            const effect = Effect.addCustomEffect(name, roundDuration);

            document.getElementById('form').innerHTML = '';
            InvalidStateService.reset();

            this.onSubmitFormCallback(effect);
        }
    }

    cancel() {
        document.getElementById('form').innerHTML = '';
        InvalidStateService.reset();
    }
}