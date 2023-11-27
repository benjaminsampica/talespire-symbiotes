import Buff from './buff.js';
import InvalidStateService from './invalidStateService.js';

export default class addBuffForm {
    constructor(creature, onSubmitFormCallback) {
        this.onSubmitFormCallback = onSubmitFormCallback;
        this.creature = creature;

        this.initialize();
    }

    initialize()
    {
        let html = `
            <h3>Add A Buff</h3>
            <select id='selected-buff' class='w-100'>
        `;

        Buff.list().forEach(b => {
            html += `<option>${b.name}</option>`
        });

        html += `
            </select>
            <button id='submit-buff-form' class='mt-1'>Add</button>
            <button id='cancel-buff-form' class='mt-1'>Cancel</button>
        `

        document.getElementById('add-buff-form').innerHTML = html;
    }

    submit()
    {
        let name = document.getElementById('selected-buff').value;
        if(name === null || undefined)
        {
            InvalidStateService.setInvalidState("Please choose a buff.");
        }
        else {
            this.creature.addBuff(name);
        
            document.getElementById('add-buff-form').innerHTML = '';
            InvalidStateService.resetInvalidState();
            this.onSubmitFormCallback();
        }
    }

    cancel()
    {
        document.getElementById('add-buff-form').innerHTML = '';
        InvalidStateService.resetInvalidState();
    }
}