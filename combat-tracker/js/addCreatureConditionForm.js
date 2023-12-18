import Condition from './condition.js';
import InvalidStateService from './invalidStateService.js';

export default class addCreatureConditionForm {
    constructor(creature, onSubmitFormCallback) {
        this.onSubmitFormCallback = onSubmitFormCallback;
        this.creature = creature;

        this.initialize();
    }

    initialize() {
        let html = `
            <h3>Add A Creature Condition</h3>
            <select id='selected-condition' class='w-100'>
        `;

        Condition.list().forEach(b => {
            html += `<option>${b.name}</option>`
        });

        html += `
            </select>
            <button id='submit-condition-form' class='mt-1'>Add</button>
            <button id='cancel-condition-form' class='mt-1'>Cancel</button>
        `

        document.getElementById('form').innerHTML = html;
    }

    submit() {
        let name = document.getElementById('selected-condition').value;
        if (name === null || name === undefined) {
            InvalidStateService.setInvalidState("Please choose a condition.");
        }
        else {
            this.creature.addCondition(name);

            document.getElementById('form').innerHTML = '';
            InvalidStateService.reset();
            this.onSubmitFormCallback();
        }
    }

    cancel() {
        document.getElementById('form').innerHTML = '';
        InvalidStateService.reset();
    }
}