import Condition from './condition.js';
import InvalidStateService from './invalidStateService.js';

export default class addCustomEffectForm {
    constructor(onSubmitFormCallback) {
        this.onSubmitFormCallback = onSubmitFormCallback;
        this.initialize();
    }

    initialize() {
        let html = `
            <h3>Add A Custom Condition</h3>
            Name
            <input id='custom-condition-name' class='w-100' required placeholder='Exhaustion'/>
        `;

        html += `
            <button id='submit-add-custom-condition-form' class='mt-1'>Add</button>
            <button id='cancel-add-custom-condition-form' class='mt-1'>Cancel</button>
        `

        document.getElementById('form').innerHTML = html;
    }

    submit() {
        let name = document.getElementById('custom-condition-name').value;
        if (name.trim().length === 0) {
            InvalidStateService.setInvalidState("Please choose a name.");
        }
        else {
            const effect = Condition.addCustomCondition(name);

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