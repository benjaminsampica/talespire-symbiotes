import Condition from './condition.js';
import InvalidStateService from './invalidStateService.js';

export default class removeCustomConditionForm {
    constructor(onSubmitFormCallback) {
        this.onSubmitFormCallback = onSubmitFormCallback;
        this.initialize();
    }

    initialize() {
        let html = `
            <h3>Remove A Custom Condition</h3>
            <select id='selected-condition' class='w-100'>
        `;

        Condition.customConditions.forEach(b => {
            html += `<option value='${b.name}'>${b.name}</option>`
        });

        html += `
            </select>
            <button id='submit-remove-custom-condition-form' class='mt-1'>Remove</button>
            <button id='cancel-remove-custom-condition-form' class='mt-1'>Cancel</button>
        `


        document.getElementById('form').innerHTML = html;
    }

    submit() {
        let selectedCondition = document.getElementById('selected-condition').value;

        if(selectedCondition.trim().length === 0)
        {
            InvalidStateService.setInvalidState("Please choose a condition to remove.");
        }
        else {
            Condition.removeCustomCondition(selectedCondition);

            document.getElementById('form').innerHTML = '';
            InvalidStateService.reset();

            this.onSubmitFormCallback(selectedCondition);
        }
    }

    cancel() {
        document.getElementById('form').innerHTML = '';
        InvalidStateService.reset();

        // Talespire's dropdown gets stuck when there are no items if not removed explicitly.
        var dropdowns = document.getElementsByTagName('vuplex-dropdown-container');
        Array.from(dropdowns).forEach(e => {
            e.remove();
        })
    }
}