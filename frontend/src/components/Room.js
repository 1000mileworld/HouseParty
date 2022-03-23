import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { Grid, Button, Typography } from "@material-ui/core";
import CreateRoomPage from "./CreateRoomPage";

function Room(props) {
    const { roomCode } = useParams(); //must use with react router dom v6, only compatible with function component
    const history = useNavigate();

    const [votesToSkip, setVotesToSkip] = useState(2);
    const [guestCanPause, setGuestCanPause] = useState(false);
    const [isHost, setIsHost] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

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
    const updateShowSettings = (value) => {
        setShowSettings(value);
    }
    let RenderSettingsButton = () => {
        if(isHost){
            return (
                <Grid item xs={12} align="center">
                    <Button variant="contained" color="primary" onClick={() => updateShowSettings(true)}>Settings</Button>
                </Grid>
            ); 
        }
        return null      
    }
    let RenderSettings = () => {
        return(
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <CreateRoomPage
                        update={true}
                        votesToSkip={votesToSkip}
                        guestCanPause={guestCanPause}
                        roomCode={roomCode}
                        updateCallback={true}
                    />
                </Grid>
                <Grid item xs={12} align="center">
                    <Button variant="contained" color="secondary" onClick={() => updateShowSettings(false)}>Close</Button>
                </Grid>
            </Grid>
        );
    }

    getRoomDetails()

    if(showSettings) {
        return <RenderSettings />
    }
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
            <RenderSettingsButton />
            <Grid item xs={12} align="center">
                <Button color="secondary" variant="contained" onClick={leaveButtonPressed}>Leave Room</Button>
            </Grid>
        </Grid>
    );
};
export default Room;