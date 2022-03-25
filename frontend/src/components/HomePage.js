import React, { useState, useEffect } from 'react';
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import Room from "./Room";
import { Grid, Button, ButtonGroup, Typography } from '@material-ui/core';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, Redirect } from 'react-router-dom';
import AppInfo from './info';

function HomePage(props) {
    const [roomCode, setRoomCode] = useState(null)
    // useEffect(() => {
    //     fetch('/api/user-in-room').then((response)=>response.json())
    //     .then((data)=>{
    //         setRoomCode(data.code)
    //     });
    // });

    let RenderHomePage = () => {
        //check user in room here instead of useEffect
        //prevent error where user has another tab open to the same room, deletes room in that tab, and tries to click leave room in the original tab
        fetch('/api/user-in-room').then((response)=>response.json()) 
        .then((data)=>{
            setRoomCode(data.code)
        });
        if(roomCode){
            //use Navigate instead of Redirect; replace=true replaces location in browsing history stack
            //console.log(`trying to redirect to room ${roomCode}`)
            return <Navigate to={`/room/${roomCode}`} replace={true}/>
        }
        return(
            <Grid container spacing={3}>
                <Grid item xs={12} align="center">
                    <Typography variant="h3" component="h3">House Party</Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <ButtonGroup disableElevation variant="contained" color="primary" className='frontpage-buttons'>
                        <Button color="primary" to="/join" component={Link}>Join a Room</Button>
                        <Button color="default" to="/info" component={Link}>Info</Button>
                        <Button color="secondary" to="/create" component={Link}>Create a Room</Button>
                    </ButtonGroup>
                </Grid>
            </Grid>
        );       
    }
    const clearRoomCode = () => {
        setRoomCode(null)
    }
    return (
        <Router>
            <Routes>
                <Route path="/" element={<RenderHomePage/>}/>
                <Route path="/join" element={<RoomJoinPage/>} />
                <Route path="/info" element={<AppInfo/>} />
                <Route path="/create" element={<CreateRoomPage/>} />
                <Route path="/room/:roomCode" element={<Room leaveRoomCallback={clearRoomCode}/>} />
            </Routes>
        </Router>
    );
};
export default HomePage