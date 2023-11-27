import Buff from './buff.js';
import InvalidStateService from './invalidStateService.js';

class addBuffForm {
    constructor(creature, onSubmitFormCallback) {
        this.onSubmitFormCallback = onSubmitFormCallback;
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
            <button onclick='submitBuffForm()'>Add Buff</button>
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

        creature.addBuff(name);
        
        document.getElementById('add-buff-form').innerHTML = '';
        InvalidStateService.resetInvalidState();
        onSubmitFormCallback();
    }

    cancelBuffSubmission()
    {
        document.getElementById('add-buff-form').innerHTML = '';
        resetInvalidState();
    }
}

export default addBuffForm;