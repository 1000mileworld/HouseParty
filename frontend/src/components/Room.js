import React, { useState } from "react";
import { useParams } from 'react-router-dom';

function Room(props) {
    const [votesToSkip, setVotesToSkip] = useState(2);
    const [guestCanPause, setGuestCanPause] = useState(false);
    const [isHost, setIsHost] = useState(false);
    const { roomCode } = useParams(); //must use with react router dom v6, only compatible with function component
    
    const getRoomDetails = () => {
        fetch('/api/get-room'+'?code='+roomCode)
        .then((response)=>response.json())
        .then((data)=>{
            setVotesToSkip(data.votes_to_skip)
            setGuestCanPause(data.guest_can_pause)
            setIsHost(data.is_host)
        })
    }

    getRoomDetails()
    return (
        <div>
            <h3>{roomCode}</h3>
            <p>Votes: {votesToSkip}</p>
            <p>Guest Can Pause: {guestCanPause.toString()}</p>
            <p>Host: {isHost.toString()}</p>
        </div>
    );
};
export default Room;