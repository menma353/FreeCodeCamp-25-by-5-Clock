import { useState, useEffect, useCallback, useRef } from "react"
import { actions, breakTimer } from "./Actions"
import { useDispatch, useSelector } from "react-redux"



function Timer(){
    

    /*useEffect(() => {
        setTimerWorking ((timerWorking) => {timerWorking});
      }, [timerWorking]);*/

      //To see if the timer is working and set it
    const [value, changeTimerWorking] = useState(false)
    const timerWorking = useRef(false);

    const setTimerWorking = (value) => {
        timerWorking.current = value
        changeTimerWorking(value)
      };

    useEffect(() => {
        changeTimerWorking((value) => value)
    }, [value]);


    //To see if the refresh button is clicked, if clicked it will turn true and the timer will be refreshed
    const refresh = useRef(false)
    const setRefresh = (value) => {
        refresh.current = value
    }


    const theBreak = useSelector(state => state.breakTime)
    const session = useSelector(state => state.sessionTime)
    const dispatch = useDispatch()
    
    let p

    //Substitute time
    const subTime = useRef(session)
    const setSubTime = (value) => {
        subTime.current = value
    }

    
    
    
    //Previous session time to use when looping back
    const prevSession = useRef(session)
    const setPrevSession = (value) => {
        prevSession.current = value
    }
    //Previous break time to use when looping back
    const prevBreak = useRef(theBreak)
    const setPrevBreak = (value) => {
        prevBreak.current = value
    }
    
    //To determine the type of timer 
    const type = useRef('session')
    const setType = (value) => {
        type.current = value
    }

    //To tell if ther timer has started at all, it remains true even if paused but reverts back to false when the timer has been refreshed
    const played = useRef(false)
    const setPlayed = (value) => {
        played.current = value
    }

    const [play, setPlay] = useState(false)

    useEffect(() => {
        setPlay(() => played.current)
    }, [play]);

    //To tell if the timer is to llop or continue from a pause
    const valid = useRef(false)
    const setValid = (value) => {
        valid.current = value
    }

    if(!played.current){
        setSubTime(session)
    }
    
    /*const [_time, setTime] = useState([session, theBreak])

    if(!played.current){
        setSubTime(session)
        setTime(theBreak.split(":")[0], session.split(":")[0])
    }
    else{
        setTime(prevBreak.current.split(':')[0], prevSession.current.split(':')[0])
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
        if(minutes < 10){
            minutes = `0${minutes}`
        }
        return seconds >= 0 && seconds < 10 ? `${minutes}:0${seconds}` :`${minutes}:${seconds}`
    }
    
    const myTimer = (thisTime, type) => {
        setPlayed(true)
        setPlay(true)
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
                        setSubTime(p)
                    }
                }
                else{
                    if(thisTime === 0 && play){
                        clearInterval(thisTimer)
                        beep()
                        setValid(false)
                        document.getElementById('timer-label').textContent = 'Break'
                        dispatch(actions.sessionTimer(prevSession.current, "SET_SESSION"))
                        setSubTime(prevBreak.current)
                        document.getElementById('time-left').textContent = prevBreak.current
                        myTimer(toMilliseconds(prevBreak.current), 'break')  
                        
                    }
                    else{
                        console.log("Hello", timerWorking.current)
                        p = timer(p)
                        document.getElementById('time-left').textContent = p
                        //dispatch(actions.sessionTimer(p, "SET_SESSION"))
                        thisTime = thisTime - 1000 
                        console.log('This is p ', p , thisTime, prevSession)
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
                        setSubTime(p)
                        //console.log(`New Break ${theBreak} and new valid ${valid.current} and p ${p}`)
                    }
                }
                else{
                    if(thisTime === 0 && play){
                        clearInterval(thisTimer)
                        beep()
                        setValid(false)
                        document.getElementById('timer-label').textContent = 'Session'
                        dispatch(actions.breakTimer(prevBreak.current, "SET_BREAK"))
                        setSubTime(prevSession.current)
                        document.getElementById('time-left').textContent = prevSession.current
                        myTimer(toMilliseconds(prevSession.current), 'session')  
                            
                        
                    }
                    else{
                        console.log('Break-time ', prevBreak)
                        document.getElementById('time-left').textContent = p
                        p = timer(p)
                        document.getElementById('time-left').textContent = p
                        //dispatch(actions.sessionTimer(p, "SET_BREAK"))
                        thisTime = thisTime - 1000 
                        console.log(theBreak, thisTime)
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
            console.log("Refresh ", refresh.current)
            myTimer(thisTime, type.current)
        }
    }


    function beep(){
        let times = 0
        
        const audio = document.getElementById('beep')
        audio.currentTime = 0;
        audio.volume = 0.65;
        audio.loop = true
        if(!refresh.current){
          audio.play()  
        }
        times = times + 1
        setTimeout(() => {
            audio.loop = false
        }, 2000)
        
    }

    function reset(){
        console.log("Doing refresh")
        setPlay(false)
        setPlayed(false)
        setRefresh(false)
        dispatch(actions.sessionTimer("25:00", "SET_SESSION"))
        dispatch(actions.breakTimer("5:00", "SET_BREAK"))
        document.getElementById('time-left').textContent = '25:00'
        console.log("Play", play, "Played ", played.current, session)
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
                            <p id='break-length'>{play ? Number(prevBreak.current.split(':')[0]) : Number(theBreak.split(":")[0])}</p>
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
                            <p id='session-length'>{play ? Number(prevSession.current.split(':')[0]) : Number(session.split(":")[0])}</p>
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
                    <p id='time-left'>{played.current ? subTime.current : session}</p>
                </div>
                <div class='play-pause'>
                    {timerWorking.current ? 
                        <button class='btn' id='start_stop' onClick = {() => startTimer('end')}><i class="fa fa-pause fa-2x" ></i></button> 
                            :
                        <button class='btn' id="start_stop" onClick = {() => startTimer('start')} ><i class="fa fa-play fa-2x"></i></button> 
                    }
                    <audio id='beep' src='https://www.soundjay.com/buttons/sounds/button-09a.mp3'></audio>
                    <button class='btn' id='reset' onClick = {() => startTimer('refresh')}><i class="fa fa-refresh fa-2x"></i></button>
                </div>
                <button onClick={() => beep()}></button>
            </div>
        </>
    )
}

export default Timer