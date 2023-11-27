import Condition from './condition.js';
import InvalidStateService from './invalidStateService.js';
import EncounterStateService from './encounterStateService.js';

document.addEventListener("click", function(e) {
    const target = e.target.closest("#submit-condition-form");
  
    if(target){
        form.submitBuffForm();
    }
});

document.addEventListener("click", function(e) {
    const target = e.target.closest("#trigger-condition-form");
  
    if(target) {
        const creatureIndex = target.value;
        form = new addConditionForm(creatureIndex);
    }
});

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
        else {
            creature.addCondition(name);
        
            document.getElementById('add-condition-form').innerHTML = '';
            InvalidStateService.resetInvalidState();
            EncounterStateService.refreshTrackedCreaturesDOM();
        }
    }

    cancelConditionSubmission()
    {
        document.getElementById('add-condition-form').innerHTML = '';
        InvalidStateService.resetInvalidState();
    }
}

export default addConditionForm;