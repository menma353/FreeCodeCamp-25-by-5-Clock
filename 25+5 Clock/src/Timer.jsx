import { useState, useEffect, useCallback, useRef } from "react"
import { actions, breakTimer } from "./Actions"
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


    const theBreak = useSelector(state => state.breakTime)
    const session = useSelector(state => state.sessionTime)
    const dispatch = useDispatch()
    let p

    const prevSession = useRef(session)
    const setPrevSession = (value) => {
        prevSession.current = value
    }

    const prevBreak = useRef(theBreak)
    const setPrevBreak = (value) => {
        prevBreak.current = value
    }
    
    const type = useRef('session')
    const setType = (value) => {
        type.current = value
    }

    const played = useRef(false)
    const setPlayed = (value) => {
        played.current = value
    }

    const [play, setPlay] = useState(false)

    useEffect(() => {
        setPlay((value) => value)
    }, [play]);

    const valid = useRef(false)
    const setValid = (value) => {
        valid.current = value
    }
    
    

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
    
    const myTimer = (thisTime, type) => {
        console.log(valid.current, prevSession.current)
        if(valid.current){
            p = type === 'session' ? session  : theBreak
        }
        else{
            p = type === 'session' ? prevSession.current : prevBreak.current
        }
        
        console.log('This is ', p)
        const thisTimer = setInterval(() => {
            if(type === 'session'){
                if(refresh.current || !timerWorking.current){
                    setType('session')
                    clearInterval(thisTimer)
                    if(refresh.current){
                        reset()
                        
                    }
                    else{
                        setValid(true)
                        dispatch(actions.sessionTimer(p, "SET_SESSION"))
                    }
                }
                else{
                    console.log("Hello", timerWorking.current)
                    document.getElementById('timer-label').textContent = 'Session'
                    p = timer(p)
                    document.getElementById('time-left').textContent = p
                    //dispatch(actions.sessionTimer(p, "SET_SESSION"))
                    thisTime = thisTime - 1000 
                    console.log('This is p ', p , thisTime, prevSession)
                    if(thisTime === 0){
                        clearInterval(thisTimer)
                        beep()
                        setValid(false)
                        dispatch(actions.sessionTimer(prevSession.current, "SET_SESSION"))
                        setTimeout(() => {
                            document.getElementById('time-left').textContent = theBreak
                            myTimer(toMilliseconds(prevBreak.current), 'break')  
                        }, 1000)
                    }
            }
            
        }
            else{
                if(refresh.current || !timerWorking.current){
                    setType('break')
                    clearInterval(thisTimer)
                    if(refresh.current){
                        reset()
                    }
                    else{
                        setValid(true)
                        dispatch(actions.breakTimer(p, "SET_BREAK"))
                        //console.log(`New Break ${theBreak} and new valid ${valid.current} and p ${p}`)
                    }
                }
                else{
                    console.log('Break-time ', prevBreak)
                    document.getElementById('timer-label').textContent = 'Break'
                    document.getElementById('time-left').textContent = p
                    p = timer(p)
                    document.getElementById('time-left').textContent = p
                    //dispatch(actions.sessionTimer(p, "SET_BREAK"))
                    thisTime = thisTime - 1000 
                    console.log(theBreak, thisTime)
                    if(thisTime === 0){
                        clearInterval(thisTimer)
                        beep()
                        setValid(false)
                        dispatch(actions.breakTimer(prevBreak.current, "SET_BREAK"))
                        setTimeout(() => {
                            document.getElementById('time-left').textContent = session
                            myTimer(toMilliseconds(prevSession.current), 'session')  
                            
                        }, 1000)
                    }
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
        let thisTime = type.current === 'session' ? toMilliseconds(session) : toMilliseconds(theBreak) 
        if(!played.current){
            setPrevSession(session)
            setPrevBreak(theBreak)
        }
        setPlayed(true)
        setPlay(true)
        if(action === 'start'){
            setTimerWorking(true)
            setRefresh(false)
            console.log("True" ,timerWorking.current)
            myTimer(thisTime, type.current)
            
        } 
       else if(action === 'end'){
            setTimerWorking(false)
            console.log("False", timerWorking.current)
        }
        else if(action === 'refresh'){
            setTimerWorking(false)
            setRefresh(true)
            setType('session')
            setPlay(false)
            setPlayed(false)
            console.log("Refresh ", refresh.current)
            myTimer(thisTime, type.current)
        }
    }


    function beep(){
        let times = 0
        const beep = setInterval(() => {
            const audio = document.getElementById('beep')
            audio.currentTime = 0;
            audio.volume = 0.65;
            audio.play()
            times = times + 1
            if(times === 2){
                clearInterval(beep)
            }
        }, 600)
    }

    function reset(){
        console.log("Doing refresh")
        dispatch(actions.sessionTimer("25:00", "SET_SESSION"))
        dispatch(actions.breakTimer("5:00", "SET_BREAK"))
        document.getElementById('time-left').textContent = '25:00'
    }    


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
                            <p id='break-length'>{play ? prevBreak.current.split(':')[0] : theBreak.split(":")[0]}</p>
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
                            <p id='session-length'>{play ? prevSession.current.split(':')[0] : session.split(":")[0]}</p>
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
                    <audio id='beep' src='https://www.soundjay.com/buttons/sounds/button-09a.mp3'></audio>
                    <button class='btn'><i class="fa fa-refresh fa-2x" onClick = {() => startTimer('refresh')}></i></button>
                </div>
                <button onClick={() => {
                    testAudio()
                    }}></button>
            </div>
        </>
    )
}

export default Timer