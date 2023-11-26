class Buff {
    constructor(name, roundDuration) {
        this.name = name;
        this.roundDuration = roundDuration;
    }

    static list()
    {
        return [
            new Buff('Heroism', 10), new Buff('Bless', 10)
        ]
    }
}

export default Buff