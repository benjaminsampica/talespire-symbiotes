import Effect from './effect.js';
import InvalidStateService from './invalidStateService.js';

export default class addEffectForm {
    constructor(creature, onSubmitFormCallback) {
        this.onSubmitFormCallback = onSubmitFormCallback;
        this.creature = creature;

        this.initialize();
    }

    initialize() {
        let html = `
            <h3>Add An Effect</h3>
            <select id='selected-effect' class='w-100'>
        `;

        Effect.list().forEach(b => {
            html += `<option>${b.name}</option>`
        });

        html += `
            </select>
            <button id='submit-effect-form' class='mt-1'>Add</button>
            <button id='cancel-effect-form' class='mt-1'>Cancel</button>
        `

        document.getElementById('add-effect-form').innerHTML = html;
    }

    submit() {
        let name = document.getElementById('selected-effect').value;
        if (name === null || name === undefined) {
            InvalidStateService.setInvalidState("Please choose an effect.");
        }
        else {
            this.creature.addEffect(name);

            document.getElementById('add-effect-form').innerHTML = '';
            InvalidStateService.resetInvalidState();
            this.onSubmitFormCallback();
        }
    }

    cancel() {
        document.getElementById('add-effect-form').innerHTML = '';
        InvalidStateService.resetInvalidState();
    }
}