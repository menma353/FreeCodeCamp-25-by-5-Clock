import { useState } from "react"
import { actions, breakTimer } from "./Actions"
import { useDispatch, useSelector } from "react-redux"

function Timer(){

    const theBreak = useSelector(state => state.breakTime)
    const session = useSelector(state => state.sessionTime)
    const dispatch = useDispatch()

    function toMilliseconds(time){
        const [minute, seconds] = time.split(':')
        const newTime = (Number(minute) * 60 * 1000) + (Number(seconds) * 1000)
    }
    

    function startTimer(action){

        const myTimer = setInterval(() => {dispatch(actions.timer(session, 'START_TIMER'))}, 1000)

        if(action === 'end'){
            clearInterval(myTimer)
        }
    }
    

    return(
        <>
            <div class='session-break'>
                <div class='break'>
                    <p id='break-label'>
                        Break Length
                    </p>
                    <div class='control'>
                        <button id='break-increment' class='btn' onClick = {() => dispatch(actions.breakTimer(theBreak, 'BREAK_INCREMENT'))}><i class="fa fa-plus"></i></button>
                        <p id='break-length'>{theBreak.split(":")[0]}</p>
                        <button id='break-decrement' class='btn' onClick = {() => dispatch(actions.breakTimer(theBreak, 'BREAK_DECREMENT'))}><i class="fa fa-minus"></i></button>
                    </div>
                    
                </div>
                <div class='session'>
                    <p id='session-label'>
                        Session Length
                    </p>
                    <div class='control'>
                       <button id='session-increment' class='btn' onClick = {() => dispatch(actions.sessionTimer(session, 'SESSION_INCREMENT'))}><i class="fa fa-plus"></i></button>
                        <p id='session-length'>{session.split(":")[0]}</p>
                        <button id='session-decrement' class='btn' onClick = {() => dispatch(actions.sessionTimer(session, 'SESSION_DECREMENT'))}><i class="fa fa-minus"></i></button> 
                    </div>
                </div>
            </div>    

            <div class='display-body'>
                <div class='display'>
                    <p id='timer-label'>Session</p>
                    <p id='time-left'>{session}</p>
                </div>
                <div class='play-pause'>
                    <button class='btn' onClick = {startTimer}><i class="fa fa-play fa-2x"></i></button>
                    <button class='btn' onclick = {() => startTimer("end")}><i class="fa fa-pause fa-2x"></i></button>
                    <button class='btn'><i class="fa fa-refresh fa-2x"></i></button>
                </div>
                
            </div>
        </>
    )
}

export default Timer