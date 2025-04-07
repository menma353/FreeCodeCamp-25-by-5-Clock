

function Timer(){

    return(
        <>
            <div class='session-break'>
                <div class='break'>
                    <p id='break-label'>
                        Break Length
                    </p>
                    <div class='control'>
                        <button id='break-increment' class='btn'><i class="fa fa-plus"></i></button>
                        <p id='break-length'>5</p>
                        <button id='break-decrement' class='btn'><i class="fa fa-minus"></i></button>
                    </div>
                    
                </div>
                <div class='session'>
                    <p id='session-label'>
                        Session Length
                    </p>
                    <div class='control'>
                       <button id='session-increment' class='btn'><i class="fa fa-plus"></i></button>
                        <p id='session-length'>25</p>
                        <button id='session-decrement' class='btn'><i class="fa fa-minus"></i></button> 
                    </div>
                </div>
            </div>    

            <div class='display-body'>
                <div class='display'>
                    <p id='timer-label'>Session</p>
                    <p id='time-left'>25:00</p>
                </div>
                <div class='play-pause'>
                    <button class='btn'><i class="fa fa-play fa-2x"></i>  <i class="fa fa-pause fa-2x"></i></button>
                    <button class='btn'><i class="fa fa-refresh fa-2x"></i></button>
                </div>
                
            </div>
        </>
    )
}

export default Timer