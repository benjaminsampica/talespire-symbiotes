class Condition {
    constructor(name) {
        this.name = name;
    }

    static list() {
        return [
            new Condition('Blinded'), new Condition('Charmed'), new Condition('Deafened'), new Condition('Frightened'), new Condition('Grappled'),
            new Condition('Incapacitated'), new Condition('Invisible'), new Condition('Paralyzed'), new Condition('Petrified'),
            new Condition('Poisoned'), new Condition('Prone'), new Condition('Stunned'), new Condition('Unconscious')
        ];
    }
}

export default Condition