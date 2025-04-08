import { combineReducers } from "redux"

const timeChanger = (time, response) => {
    const times = time.split(':')
    if(response === 'add'){
        times[0] = Number(times[0]) + 1
        return times.join(':') 
    }
    else if(response === 'minus'){
        times[0] = Number(times[0]) - 1
        return times.join(':') 
    }
}

const timer = (time) => {
    const [minutes, seconds] = time.split(':')
    minutes = Number(minutes)
    seconds = Number(seconds)
    if(seconds === '00' && minute > 0){
        minutes = minutes - 1
        seconds = '59' 
    }
    else if(minutes === 0 && seconds === 0){

    }
    else{
        seconds = seconds - 1
    }
    return `${minutes}:${seconds}`
}

const breakReducer = (state = '5:00', action) => {
    switch(action.type){
        case 'BREAK_INCREMENT':
            if(Number(action.value.split(':')[0]) > 1 && Number(action.value.split(':')[0] < 60)){
                return timeChanger(action.value, "add")
                
            }
            else{
                return state
            }
        case 'BREAK_DECREMENT':
            if(Number(action.value.split(':')[0]) > 1 && Number(action.value.split(':')[0] < 60)){
                return timeChanger(action.value, "minus")
                
            }
            else{
                return state
            }
        default:
            return state
    }
}

const sessionReducer = (state = '25:00', action) => {
    switch(action.type){
        case 'SESSION_INCREMENT':
            if(Number(action.value.split(':')[0]) > 1 && Number(action.value.split(':')[0] < 60)){
                return timeChanger(action.value, "add")
                
            }
            else{
                return state
            }
        case 'SESSION_DECREMENT':
            if(Number(action.value.split(':')[0]) > 1 && Number(action.value.split(':')[0] < 60)){
                return timeChanger(action.value, "minus")
            }
            else{
                return state
            }
        default:
            return state
    }
}

const timeReducer = (state = '25:00', action) => {
    switch(action.type){
        case 'START_TIMER':
            return timer(action.value)
        default:
            return state

    }
}

const allReducers = combineReducers({
    breakTime: breakReducer,
    sessionTime: sessionReducer
})


export default allReducers