;; domain file: domain-VacuumCleaner_ground_floor.pddl
(define (domain VacuumCleaner_ground_floor)
    (:requirements :strips)
    (:predicates
        (vacuum ?obj)
        (room ?before)
        (adj ?before ?after)
        (in_room ?obj ?before)
        (suck ?after)
        (clean ?after)
        (suck_and_clean ?obj ?after)
        (state ?status)
        (set_status ?obj ?status)
        (not_clean ?r)
        (not_people_in_room ?r)
        (not_suck ?r)              
    )
    
        (:action SuckAndClean
            :parameters (?obj ?before ?after)
            :precondition (and
                (vacuum ?obj)
                (room ?before)
                (room ?after)
                (adj ?before ?after)
                (in_room ?obj ?before)
                (adj ?after ?before)
                (suck ?after)
                (clean ?after)
            )
            :effect (and
                (suck_and_clean ?obj ?after)
                (in_room ?obj ?after)
                (not (in_room ?obj ?before))
            )
        )
        
        (:action switchVacuumCleaner
            :parameters (?obj ?status)
            :precondition (and
                (vacuum ?obj)
                (state ?status)
            )
            :effect (and
                (set_status ?obj ?status)
            )
        )
        
        (:action Clean
            :parameters (?r ?obj)
            :precondition (and
                (room ?r)
                (not_clean ?r)
                (vacuum ?obj)
                (not_people_in_room ?r)
            )
            :effect (and
                (clean ?r)
            )
        )
        
        (:action Suck
            :parameters (?r ?obj)
            :precondition (and
                (room ?r)
                (not_suck ?r)
                (vacuum ?obj)
                (not_people_in_room ?r)
            )
            :effect (and
                (suck ?r)
            )
        )
)