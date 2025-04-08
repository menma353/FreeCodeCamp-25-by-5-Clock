

export const breakTimer = (value, actionType) => {
    return {type: actionType, value}
}

export const sessionTimer = (value, actionType) => {
    return {type: actionType, value}
}

export const timer = (value, actionType) => {
    return {type: actionType, value}
}

export * as actions from './Actions'