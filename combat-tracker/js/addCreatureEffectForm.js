import Effect from './effect.js';
import InvalidStateService from './invalidStateService.js';

export default class addCreatureEffectForm {
    constructor(creature, onSubmitFormCallback) {
        this.onSubmitFormCallback = onSubmitFormCallback;
        this.creature = creature;

        this.initialize();
    }

    initialize() {
        let html = `
            <h3>Add A Creature Effect</h3>
            <select id='selected-effect' class='w-100'>
        `;

        Effect.list().forEach(b => {
            html += `<option value='${b.name}'>${b.name} (${b.roundDuration})</option>`
        });

        html += `
            </select>
            <button id='submit-effect-form' class='mt-1'>Add</button>
            <button id='cancel-effect-form' class='mt-1'>Cancel</button>
        `

        document.getElementById('form').innerHTML = html;
    }

    submit() {
        let name = document.getElementById('selected-effect').value;
        if (name === null || name === undefined) {
            InvalidStateService.setInvalidState("Please choose an effect.");
        }
        else {
            this.creature.addEffect(name);

            document.getElementById('form').innerHTML = '';
            InvalidStateService.resetInvalidState();
            this.onSubmitFormCallback();
        }
    }

    cancel() {
        document.getElementById('form').innerHTML = '';
        InvalidStateService.resetInvalidState();
    }
}