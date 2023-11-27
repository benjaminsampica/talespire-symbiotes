import Condition from './condition.js';
import InvalidStateService from './invalidStateService.js';

class addConditionForm {
    constructor(creature, onSubmitFormCallback) {
        this.onSubmitFormCallback = onSubmitFormCallback;
        this.creature = creature;

        setConditionFormHtml();
    }

    setConditionFormHtml()
    {
        let html = `
            <select id='selected-condition'>
        `;

        Condition.list().forEach(b => {
            html += `<option>${b.name}</option>`
        });

        html += `
            </select>
            <button onclick='submitConditionForm()'>Add Condition</button>
            <button onclick='cancelConditionSubmission()'>Cancel</button>
        `

        document.getElementById('add-condition-form').innerHTML = html;
    }

    submitConditionForm()
    {
        var name = document.getElementById('selected-condition').value;
        if(name === null || undefined)
        {
            InvalidStateService.setInvalidState("Please choose a condition.");
        }

        creature.addCondition(name);
        
        document.getElementById('add-condition-form').innerHTML = '';
        InvalidStateService.resetInvalidState();
        onSubmitFormCallback();
    }

    cancelConditionSubmission()
    {
        document.getElementById('add-condition-form').innerHTML = '';
        InvalidStateService.resetInvalidState();
    }
}

export default addConditionForm;