import Effect from './effect.js';
import InvalidStateService from './invalidStateService.js';

export default class removeCustomEffectForm {
    constructor(onSubmitFormCallback) {
        this.onSubmitFormCallback = onSubmitFormCallback;
        this.initialize();
    }

    initialize() {
        let html = `
            <h3>Remove A Custom Effect</h3>
            <select id='selected-effect' class='w-100'>
        `;

        Effect.customEffects.forEach(b => {
            html += `<option value='${b.name}'>${b.name} (${b.roundDuration})</option>`
        });

        html += `
            </select>
            <button id='submit-remove-custom-effect-form' class='mt-1'>Remove</button>
            <button id='cancel-remove-custom-effect-form' class='mt-1'>Cancel</button>
        `


        document.getElementById('form').innerHTML = html;
    }

    submit() {
        let selectedEffect = document.getElementById('selected-effect').value;

        if(selectedEffect.trim().length === 0)
        {
            InvalidStateService.setInvalidState("Please choose an effect to remove.");
        }
        else {
            Effect.removeCustomEffect(selectedEffect);

            document.getElementById('form').innerHTML = '';
            InvalidStateService.reset();

            this.onSubmitFormCallback(selectedEffect);
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