import React, { Component } from 'react';
import { Button, Grid, Typography, TextField, FormControl, FormControlLabel, Radio, RadioGroup, FormHelperText } from '@material-ui/core';
import { Link } from 'react-router-dom';

export default class CreateJoinPage extends Component {
    defaultVotes = 2;
    constructor(props){
        super(props);
        this.state = {
            guestCanPause: true,
            votesToSkip: this.defaultVotes,
        };
        //this.handleRoomButtonPressed = this.handleRoomButtonPressed.bind(this); //no need if using arrow func
    }

    handleVotesChange = (e) => {
        this.setState({
            votesToSkip: e.target.value,
        });
    }

    handleGuestCanPauseChange = (e) =>  {
        this.setState({
            guestCanPause: e.target.value==='true' ? true : false,
        })
    }

    handleRoomButtonPressed = () => {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                votes_to_skip: this.state.votesToSkip, //name must match serializer.data.get in views.py
                guest_can_pause: this.state.guestCanPause,
            }),
        };
        fetch('/api/create-room', requestOptions)
        .then((response)=>response.json())
        .then((data)=>console.log(data));
    }

    render() {
        return (//comes from material-ui
            <Grid container spacing={1}> 
                <Grid item xs={12} align="center">
                    <Typography component='h4' variant='h4'>
                        Create a Room
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <FormControl component='fieldset'>
                        <FormHelperText component="span">
                            <div align="center">Guest Control of Playback State</div>
                        </FormHelperText>
                        <RadioGroup row defaultValue='true' onChange={this.handleGuestCanPauseChange}>
                            <FormControlLabel
                                value='true'
                                control={<Radio color='primary'/>}
                                label='Play/Pause'
                                labelPlacement='bottom'
                            />
                            <FormControlLabel
                                value='false'
                                control={<Radio color='secondary'/>}
                                label='No Control'
                                labelPlacement='bottom'
                            />
                        </RadioGroup>
                    </FormControl>
                </Grid>
                <Grid item xs={12} align="center">
                    <FormControl>
                        <TextField
                            required={true}
                            type='number'
                            onChange={this.handleVotesChange}
                            defaultValue={this.defaultVotes}
                            inputProps={{
                                min: 1,
                                style: {textAlign: 'center'}
                            }}
                        />
                        <FormHelperText component="span">
                            <div align='center'>Votes Required to Skip Song</div>
                        </FormHelperText>
                    </FormControl>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button color="primary" variant="contained" onClick={this.handleRoomButtonPressed}>Create a Room</Button>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button color="secondary" variant="contained" to="/" component={Link}>Back</Button>
                </Grid>
            </Grid> 
        );
    }
}