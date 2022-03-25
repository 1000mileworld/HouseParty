import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { Grid, Button, Typography, Collapse } from "@material-ui/core";
import CreateRoomPage from "./CreateRoomPage";
import MusicPlayer from "./MusicPlayer";
import Alert from '@material-ui/lab/Alert';

function Room(props) {
    const { roomCode } = useParams(); //must use with react router dom v6, only compatible with function component
    const history = useNavigate();

    const [votesToSkip, setVotesToSkip] = useState(2); //updating state by its setter forces component to re-render, which calls all the api endpoints again
    const [guestCanPause, setGuestCanPause] = useState(false);
    const [isHost, setIsHost] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false);
    const [song, setSong] = useState({});
    const [hasSong, setHasSong] = useState(true);
    const [displayInfo, setDisplayInfo] = useState(true);

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
            if(isHost){
                authenticateSpotify();
            }
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
    const authenticateSpotify = () => {
        fetch('/spotify/is-authenticated').then((response)=>response.json())
        .then((data)=>{
            setSpotifyAuthenticated(data.status);
            if(!data.status){ //if user hasn't been authenticated, fetch auth url
                fetch('/spotify/get-auth-url').then((response)=>response.json())
                .then((data)=>{
                    window.location.replace(data.url); //redirect to spotify auth page
                })
            }
        })
    }

    //moved method to music player so it doesn't continuously re-render whole page while updating song state
    const getCurrentSong = () => {
        fetch("/spotify/current-song")
        .then((response) => {
          if (!response.ok) {
            return {};
          } else {
            // try { 
            //     //won't be able to parse response into json if no song playing
            //     const json = JSON.parse(response); //doesn't work on legit response either
            //   } catch (e) {
            //     console.log("Please start playing a song in your Spotify account")
            //     setHasSong(false);
            //     return {}; //invalid json
            //   }
            // setHasSong(true);
            
            //response.json() returns a Promise
            return response.json().catch(() => console.log('No song found playing in Spotify.'));
          }
        })
        .then((data) => {
            setTimeout(function() {
                setSong(data);
                //console.log(data);
            },1) //delay in setting state to prevent constant re-render (but buttons need to change quickly)
        });
    }

    //---------------Components----------------
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
                        updateCallback={getRoomDetails}
                    />
                </Grid>
                <Grid item xs={12} align="center">
                    <Button variant="contained" color="secondary" onClick={() => updateShowSettings(false)}>Close</Button>
                </Grid>
            </Grid>
        );
    }

    getRoomDetails()
    //getCurrentSong()

    if(showSettings) {
        return <RenderSettings />
    }
    return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Collapse in={displayInfo}>
                    <Alert severity="warning" onClose={()=>setDisplayInfo(false)}>Host must start first song from Spotify. Play/pause requires a premium account.</Alert>
                </Collapse>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography variant="h4" component="h4">Code: {roomCode}</Typography>
            </Grid>
            <MusicPlayer {...song} />
            <RenderSettingsButton />
            <Grid item xs={12} align="center">
                <Button color="secondary" variant="contained" onClick={leaveButtonPressed}>Leave Room</Button>
            </Grid>
        </Grid>
    );
};
export default Room;