let creature;
let onSubmitFormCallback;

class addBuffForm {
    constructor(creature, onSubmitFormCallback) {
        this.onSubmitFormCallback = onSubmitFormCallback;
        this.creature = creature;

        document.getElementById('add-buff-form').classList.remove('d-none');
    }

    submitForm()
    {
        creature.addBuff(name);
        
        document.getElementById('add-buff-form').classList.add('d-none');
        onSubmitFormCallback();
    }

    cancelBuffSubmission()
    {
        document.getElementById('add-buff-form').classList.add('d-none');
    }
}

export default addBuffForm;