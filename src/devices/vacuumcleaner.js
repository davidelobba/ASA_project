
const Agent = require( '../bdi/Agent');
//const Observable = require('..//utils//Observable');

class VacuumCleaner extends Agent {
    constructor (house, name) {
        super()
        this.house = house;         // reference to the house
        this.name = name;           // non-observable
        this.status = 'off'   // observable
    }
    switchOnVacuumCleaner (obj) {
        this.status = 'on'
        console.log(obj, '\t turned on')
    }
    switchOffVacuumCleaner (obj) {
        this.status = 'off'
        console.log(obj, '\t turned off')
    }
    Clean (room, obj) {
        console.log(obj, '\t Cleaned ' + room)
    }
    Suck (room, obj) {
        console.log(obj, '\t Sucked ' + room)
    }
    moveTo (obj, from, to) {
        console.log(obj, '\t Moved from', from, 'to', to)
    }
}

module.exports = VacuumCleaner;