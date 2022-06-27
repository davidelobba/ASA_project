const pddlActionIntention = require('../pddl/actions/pddlActionIntention')
const Agent = require('../bdi/Agent')
const Goal = require('../bdi/Goal')
const Intention = require('../bdi/Intention')
const PlanningGoal = require('../pddl/PlanningGoal')



class Check extends pddlActionIntention{
    async checkPreconditionAndApplyEffect () {
        if ( this.checkPrecondition() ) {
            this.applyEffect();
        }
        else
            throw new Error('pddl precondition not valid');
    }
}

class SuckAndClean extends Check {
    static parameters = ['obj','before','after'];
    static precondition = [ ['vacuum', 'obj'], ['room', 'before'], ['room', 'after'], ['adj', 'before', 'after'], ['in_room', 'obj', 'before'], ['adj', 'after', 'before'], ['suck', 'after'], ['clean', 'after']];
    static effect = [ ['suck_and_clean', 'obj', 'after'], ['in_room', 'obj', 'after'], ['not in_room', 'obj', 'before'] ];
    *exec ({obj, before, after}=parameters) {
        yield this.checkPreconditionAndApplyEffect();
        yield this.agent.moveTo(obj, before, after);
        this.agent.beliefs.declare('suck_and_clean' + ' ' + obj + ' ' + after);
        this.agent.beliefs.undeclare('in_room' + ' ' + obj + ' ' + before);
        this.agent.beliefs.declare('in_room' + ' ' + obj + ' ' + after);
    }
}

class Clean extends Check {
    static parameters = ['r', 'obj'];
    static precondition = [['room', 'r'],['not_clean', 'r'], ['vacuum', 'obj'], ['not_people_in_room', 'r']];
    static effect = [ ['clean', 'r']];
    *exec ({r, obj}=parameters) {
        yield this.checkPreconditionAndApplyEffect();
        yield this.agent.Clean(r, obj);
        this.agent.beliefs.declare('clean' + ' ' + r);
        this.agent.beliefs.undeclare('not_clean' + ' ' + r);
    }
}

class Suck extends Check {
    static parameters = ['r', 'obj'];
    static precondition = [['room', 'r'],['not_suck', 'r'], ['vacuum', 'obj'], ['not_people_in_room', 'r']];
    static effect = [ ['suck', 'r']];
    *exec ({r, obj}=parameters) {
        yield this.checkPreconditionAndApplyEffect();
        yield this.agent.Suck(r, obj);
        this.agent.beliefs.declare('suck' + ' ' + r);
        this.agent.beliefs.undeclare('not_suck' + ' ' + r);
    }
}

class switchVacuumCleaner extends Check {
    static parameters = ['obj','status'];
    static precondition = [ ['vacuum', 'obj'], ['state', 'status']];
    static effect = [ ['set_status', 'obj', 'status']];
    *exec ({obj, status}=parameters) {
        if (status == 'on') {
            yield this.checkPreconditionAndApplyEffect();
            yield this.agent.switchOnVacuumCleaner(obj);
            this.agent.beliefs.declare('set_status' + ' ' + obj + ' ' + status);
            this.agent.beliefs.undeclare('set_status' + ' ' + obj + ' ' + 'off');
        }else if (status == 'off') {
            yield this.checkPreconditionAndApplyEffect(), this.agent.switchOffVacuumCleaner(obj);
            this.agent.beliefs.declare('set_status' + ' ' + obj + ' ' + status);
            this.agent.beliefs.undeclare('set_status' + ' ' + obj + ' ' + 'on');
        }
    }
}

class RetryGoal extends Goal {}

class RetryFourTimesIntention extends Intention {
    static applicable (goal) {
        return goal instanceof RetryGoal
    }
    *exec ({goal}=parameters) {
        for(let i=0; i<4; i++) {
            let goalAchieved = yield this.agent.postSubGoal( goal )
            if (goalAchieved)
                return;
            this.log('wait for something to change on beliefset before retrying for the ' + (i+2) + 'th time goal', goal.toString())
            yield this.agent.beliefs.notifyAnyChange();
        }
    }
}

module.exports = {SuckAndClean, switchVacuumCleaner, Clean, Suck, RetryGoal, RetryFourTimesIntention}