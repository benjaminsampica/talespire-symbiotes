import Buff from './buff.js';
import InvalidStateService from './invalidStateService.js';
import EncounterStateService from './encounterStateService.js';

let form;

document.addEventListener("click", function(e) {
    const target = e.target.closest("#submit-buff-form");
  
    if(target){
        form.submitBuffForm();
    }
});

document.addEventListener("click", function(e) {
    const target = e.target.closest("#trigger-buff-form");
  
    if(target) {
        const creatureIndex = target.value;
        form = new addBuffForm(creatureIndex);
    }
});

export default class addBuffForm {
    constructor(creature) {
        this.creature = creature;

        setBuffFormHtml();
    }

    setBuffFormHtml()
    {
        let html = `
            <select id='selected-buff'>
        `;

        Buff.list().forEach(b => {
            html += `<option>${b.name}</option>`
        });

        html += `
            </select>
            <button id='submit-buff-form'>Add Buff</button>
            <button onclick='cancelBuffSubmission()'>Cancel</button>
        `

        document.getElementById('add-buff-form').innerHTML = html;
    }

    submitBuffForm()
    {
        var name = document.getElementById('selected-buff').value;
        if(name === null || undefined)
        {
            InvalidStateService.setInvalidState("Please choose a buff.");
        }
        else {
            creature.addBuff(name);
        
            document.getElementById('add-buff-form').innerHTML = '';
            InvalidStateService.resetInvalidState();
            EncounterStateService.refreshTrackedCreaturesDOM()
        }
    }

    cancelBuffSubmission()
    {
        document.getElementById('add-buff-form').innerHTML = '';
        InvalidStateService.resetInvalidState();
    }
}