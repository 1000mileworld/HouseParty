import React, { Component } from 'react';
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import Room from "./Room";
import { Grid, Button, ButtonGroup, Typography } from '@material-ui/core';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, Redirect } from 'react-router-dom';

export default class HomePage extends Component {
    constructor(props){
        super(props);
        this.state = {
            roomCode: null,
        }
    }

    async componentDidMount() {
        fetch('/api/user-in-room').then((response)=>response.json())
        .then((data)=>{
            this.setState({
                roomCode: data.code
            })
        });
    }
    renderHomePage() {
        if(this.state.roomCode){
            //use Navigate instead of Redirect; replace=true replaces location in browsing history stack
            return <Navigate to={`/room/${this.state.roomCode}`} replace={true}/>
        }
        return(
            <Grid container spacing={3}>
                <Grid item xs={12} align="center">
                    <Typography variant="h3" component="h3">House Party</Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <ButtonGroup disableElevation variant="contained" color="primary">
                        <Button color="primary" to="/join" component={Link}>Join a Room</Button>
                        <Button color="secondary" to="/create" component={Link}>Create a Room</Button>
                    </ButtonGroup>
                </Grid>
            </Grid>
        );
    }
    render() {
        return (
            <Router>
                <Routes>
                    <Route path="/" element={this.renderHomePage()}/>
                    <Route path="/join" element={<RoomJoinPage/>} />
                    <Route path="/create" element={<CreateRoomPage/>} />
                    <Route path="/room/:roomCode" element={<Room/>} />
                </Routes>
            </Router>
        );
    }
}