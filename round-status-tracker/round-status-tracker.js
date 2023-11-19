const conditions = [
    'Blinded', 'Charmed', 'Deafened', 'Frightened', 'Grappled', 'Incapacitated', 'Invisible', 'Paralyzed',
    'Petrified', 'Poisoned', 'Prone', 'Stunned', 'Unconscious'
];

const buffs = [
    createBuff('Heroism', 10), createBuff('Longstrider', 10)
]

function createBuff(name, roundDuration) { return new { name: name, roundDuration: roundDuration }}