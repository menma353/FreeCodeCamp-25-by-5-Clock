import { useState, useEffect, useCallback, useRef } from "react"
import { actions } from "./Actions"
import { useDispatch, useSelector } from "react-redux"



function Timer(){
    

    /*useEffect(() => {
        setTimerWorking ((timerWorking) => {timerWorking});
      }, [timerWorking]);*/
    const [value, changeTimerWorking] = useState(false)
    const timerWorking = useRef(false);

    const setTimerWorking = (value) => {
        timerWorking.current = value
        changeTimerWorking(value)
      };

    useEffect(() => {
        changeTimerWorking((value) => value)
    }, [value]);


    const refresh = useRef(false)
    const setRefresh = (value) => {
        refresh.current = value
    }

    const [valid, setValid] = useState(true)

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
    
    const myTimer = (thisTime) => {
        p = session

        const thisTimer = setInterval(() => {
        console.log("Hello", timerWorking.current)
        if(refresh.current || !timerWorking.current){
            clearInterval(thisTimer)
            if(refresh.current){
                console.log("Doing refresh")
                dispatch(actions.sessionTimer("25:00", "SET_SESSION"))
                document.getElementById('time-left').textContent = '25:00'
                
            }
            else{
                dispatch(actions.sessionTimer(p, "SET_SESSION"))
            }
        }
        else{
            p = timer(p)
            document.getElementById('time-left').textContent = p
            thisTime = thisTime - 1000 
            console.log(session, thisTime)
            if(thisTime === 0){
                clearInterval(thisTimer)
                //dispatch(actions.sessionTimer(p, "SET_SESSION"))
            }
        }
            
        }, 1000) 
     }

    function toMilliseconds(time){
        const [minute, seconds] = time.split(':')
        const newTime = (Number(minute) * 60 * 1000) + (Number(seconds) * 1000)
        return newTime
    }
    
    function startTimer(action){
        let thisTime = toMilliseconds(session)
        if(action === 'start'){
            setValid(false)
            setTimerWorking(true)
            setRefresh(false)
            console.log("True" ,timerWorking.current)
            myTimer(thisTime)
            
        } 
       else if(action === 'end'){
            setTimerWorking(false)
            console.log("False", timerWorking.current)
        }
        else if(action === 'refresh'){
            setTimerWorking(false)
            setRefresh(true)
            console.log("Refresh ", refresh.current)
            myTimer(thisTime)
            setValid(true)
        }
    }

    console.log(session)

    

    


    return(
        <>
            <div class='session-break'>
                <div class='break'>
                    <p id='break-label'>
                        Break Length
                    </p>
                    {
                        valid 
                        ? 
                        <div class='control'>
                            <button id='break-increment' class='btn' onClick = {() => dispatch(actions.breakTimer(theBreak, 'BREAK_INCREMENT'))}><i class="fa fa-plus"></i></button>
                            <p id='break-length'>{theBreak.split(":")[0]}</p>
                            <button id='break-decrement' class='btn' onClick = {() => dispatch(actions.breakTimer(theBreak, 'BREAK_DECREMENT'))}><i class="fa fa-minus"></i></button>
                        </div>
                        :
                        <div class='control'>
                            <button id='break-increment' class='btn'><i class="fa fa-plus"></i></button>
                            <p id='break-length'>{theBreak.split(":")[0]}</p>
                            <button id='break-decrement' class='btn'><i class="fa fa-minus"></i></button>
                        </div>
                    }
                   
                    
                </div>
                <div class='session'>
                    <p id='session-label'>
                        Session Length
                    </p>
                    {
                        valid 
                        ?
                        <div class='control'>
                            <button id='session-increment' class='btn' onClick = {() => dispatch(actions.sessionTimer(session, 'SESSION_INCREMENT'))}><i class="fa fa-plus"></i></button>
                            <p id='session-length'>{session.split(":")[0]}</p>
                            <button id='session-decrement' class='btn' onClick = {() => dispatch(actions.sessionTimer(session, 'SESSION_DECREMENT'))}><i class="fa fa-minus"></i></button> 
                        </div>
                     :
                       <div class='control'>
                            <button id='session-increment' class='btn'><i class="fa fa-plus"></i></button>
                            <p id='session-length'>{session.split(":")[0]}</p>
                            <button id='session-decrement' class='btn'><i class="fa fa-minus"></i></button> 
                       </div>
                    }
                </div>
            </div>    

            <div class='display-body'>
                <div class='display'>
                    <p id='timer-label'>Session</p>
                    <p id='time-left'>{session}</p>
                </div>
                <div class='play-pause'>
                    {timerWorking.current ? 
                        <button class='btn' onClick = {() => startTimer('end')}><i class="fa fa-pause fa-2x"></i></button> 
                            :
                        <button class='btn' onClick = {() => startTimer('start')} ><i class="fa fa-play fa-2x"></i></button> 
                    }
                    <button class='btn'><i class="fa fa-refresh fa-2x" onClick = {() => startTimer('refresh')}></i></button>
                </div>
                <button onClick={() => {
                    console.log('Time', timerWorking.current, ' Refresh', refresh.current)
                    }}></button>
            </div>
        </>
    )
}

export default Timer