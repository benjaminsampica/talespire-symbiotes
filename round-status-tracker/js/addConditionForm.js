import Condition from './condition.js';
import InvalidStateService from './invalidStateService.js';

export default class addConditionForm {
    constructor(creature, onSubmitFormCallback) {
        this.onSubmitFormCallback = onSubmitFormCallback;
        this.creature = creature;

        this.initialize();
    }

    initialize()
    {
        let html = `
            <h3>Add A Condition</h3>
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

        document.getElementById('add-condition-form').innerHTML = html;
    }

    submit()
    {
        let name = document.getElementById('selected-condition').value;
        if(name === null || undefined)
        {
            InvalidStateService.setInvalidState("Please choose a condition.");
        }
        else {
            this.creature.addCondition(name);
        
            document.getElementById('add-condition-form').innerHTML = '';
            InvalidStateService.resetInvalidState();
            this.onSubmitFormCallback();
        }
    }

    cancel()
    {
        document.getElementById('add-condition-form').innerHTML = '';
        InvalidStateService.resetInvalidState();
    }
}