import React, { useState } from 'react';
import { Button, Grid, Typography, TextField, FormControl, FormControlLabel, Radio, RadioGroup, FormHelperText } from '@material-ui/core';
import { Link, useNavigate } from 'react-router-dom';

function CreateRoomPage() {
    const defaultVotes = 2;
    const [votesToSkip, setVotesToSkip] = useState(defaultVotes);
    const [guestCanPause, setGuestCanPause] = useState(true);
    const history = useNavigate();

    const handleVotesChange = (e) => {
        setVotesToSkip(e.target.value)
    }

    const handleGuestCanPauseChange = (e) =>  {
        setGuestCanPause(e.target.value==='true' ? true : false)
    }

    const handleRoomButtonPressed = () => {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                votes_to_skip: votesToSkip, //name must match serializer.data.get in views.py
                guest_can_pause: guestCanPause,
            }),
        };
        fetch('/api/create-room', requestOptions)
        .then((response)=>response.json())
        //.then((data)=>console.log(data));
        .then((data) => history("/room/" + data.code));
    }

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
                    <RadioGroup row defaultValue='true' onChange={handleGuestCanPauseChange}>
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
                        onChange={handleVotesChange}
                        defaultValue={defaultVotes}
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
                <Button color="primary" variant="contained" onClick={handleRoomButtonPressed}>Create a Room</Button>
            </Grid>
            <Grid item xs={12} align="center">
                <Button color="secondary" variant="contained" to="/" component={Link}>Back</Button>
            </Grid>
        </Grid> 
    );
};
export default CreateRoomPage;