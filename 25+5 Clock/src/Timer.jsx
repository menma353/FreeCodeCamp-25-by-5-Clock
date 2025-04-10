import { useState, useEffect } from "react"
import { actions, breakTimer } from "./Actions"
import { useDispatch, useSelector } from "react-redux"



function Timer(){
    const [timerWorking, setTimerWorking] = useState(false)

    useEffect(() => {
        setTimerWorking((value) => value); 
      });


    const [refresh, setRefresh] = useState(false)
    const theBreak = useSelector(state => state.breakTime)
    const session = useSelector(state => state.sessionTime)
    const dispatch = useDispatch()
    let p
    
    
    
    

   /* const setTime = () => {
        dispatch(actions.sessionTimer(session, 'START_TIMER_SESSION'))
        console.log("Awaited ", session)
    }*/

    
    const timer = (time) => {
        let [minutes, seconds] = time.split(':')
        minutes = Number(minutes)
        seconds = Number(seconds)
        if(seconds === 0  && minutes > 0){
            minutes = minutes - 1
            seconds = '59' 
        }
        else if(minutes === 0 && seconds === 0){
    
        }
        else{
            seconds = seconds - 1
        }
        return seconds >= 0 && seconds < 10 ? `${minutes}:0${seconds}` :`${minutes}:${seconds}`
    }
    

    function toMilliseconds(time){
        const [minute, seconds] = time.split(':')
        const newTime = (Number(minute) * 60 * 1000) + (Number(seconds) * 1000)
        return newTime
    }
    
    function startTimer(action){
        let thisTime = toMilliseconds(session)
        if(action === 'start'){
            setTimerWorking(true)
            console.log("True" ,timerWorking)
            myTimer(thisTime)
            
        } 
       else if(action === 'end'){
            setTimerWorking(false)
            console.log("False", timerWorking)
            myTimer(thisTime)
        }
        else if(action === 'refresh'){
            setTimerWorking(false)
            console.log('refresh')
            setRefresh(true)
            console.log(refresh)
        }
    }
    console.log(timerWorking)

    const myTimer = async(thisTime) => {
        p = session
        const thisTimer = setInterval(async() => {
            console.log("Hello", timerWorking)
            if(refresh){
                console.log("Dam")
                clearInterval(thisTimer)
            }
            p = timer(p)
            document.getElementById('time-left').textContent = p
            thisTime = thisTime - 1000 
            console.log(session, thisTime)
            if(thisTime === 0){
                clearInterval(thisTimer)
            }
        }, 1000) 
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
                    {timerWorking ? 
                        <button class='btn' onClick = {() => startTimer('end')}><i class="fa fa-pause fa-2x"></i></button> 
                            :
                        <button class='btn' onClick = {() => startTimer('start')} ><i class="fa fa-play fa-2x"></i></button> 
                    }
                    <button class='btn'><i class="fa fa-refresh fa-2x" onClick = {() => startTimer('refresh')}></i></button>
                </div>
                
            </div>
        </>
    )
}

export default Timer