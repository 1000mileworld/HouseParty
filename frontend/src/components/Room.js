import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { Grid, Button, Typography } from "@material-ui/core";

function Room(props) {
    const { roomCode } = useParams(); //must use with react router dom v6, only compatible with function component
    const history = useNavigate();

    const [votesToSkip, setVotesToSkip] = useState(2);
    const [guestCanPause, setGuestCanPause] = useState(false);
    const [isHost, setIsHost] = useState(false);

    const getRoomDetails = () => {
        fetch('/api/get-room'+'?code='+roomCode)
        .then((response)=>{
            if (!response.ok) { //don't try to render a room if it's been deleted
                props.leaveRoomCallback; //clear room code first before redirecting
                history('/');
            }
            return response.json()
        })
        .then((data)=>{
            setVotesToSkip(data.votes_to_skip)
            setGuestCanPause(data.guest_can_pause)
            setIsHost(data.is_host)
        })
    }
    const leaveButtonPressed  = () => {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
        };
        fetch('/api/leave-room',requestOptions).then((response)=>{
            props.leaveRoomCallBack;
            history('/');
        });
    }

    getRoomDetails()
    return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Typography variant="h4" component="h4">Code: {roomCode}</Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography variant="h6" component="h6">Votes: {votesToSkip}</Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography variant="h6" component="h6">Guest Can Pause: {guestCanPause.toString()}</Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography variant="h6" component="h6">Host: {isHost.toString()}</Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <Button color="secondary" variant="contained" onClick={leaveButtonPressed}>Leave Room</Button>
            </Grid>
        </Grid>
    );
};
export default Room;