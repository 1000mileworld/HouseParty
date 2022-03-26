import React, { useState } from 'react';
import { Button, Grid, Typography, TextField, FormControl, FormControlLabel, Radio, RadioGroup, FormHelperText, Collapse } from '@material-ui/core';
import { Link, useNavigate } from 'react-router-dom';
import Alert from '@material-ui/lab/Alert';

CreateRoomPage.defaultProps = {
    votesToSkip: 2,
    guestCanPause: true,
    update: false,
    roomCode: null,
    updateCallback: () =>{}
}
function CreateRoomPage(props) {
    const [votesToSkip, setVotesToSkip] = useState(props.votesToSkip);
    const [guestCanPause, setGuestCanPause] = useState(props.guestCanPause);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const history = useNavigate();

    const handleVotesChange = (e) => {
        setVotesToSkip(e.target.value)
    }

    const handleGuestCanPauseChange = (e) =>  {
        setGuestCanPause(e.target.value==='true' ? true : false)
    }

    const createRoomButtonPressed = () => {
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

    const updateButtonPressed = () => {
        const requestOptions = {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                votes_to_skip: votesToSkip,
                guest_can_pause: guestCanPause,
                code: props.roomCode
            }),
        };
        fetch('/api/update-room', requestOptions)
        .then((response)=>{
            if(response.ok){
                setSuccessMsg("Room updated successfully!")
            }else{
                setErrorMsg("Error updating room...")
            }
            props.updateCallback
        })
    }

    let CreateButtons = () => {
        return(
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Button color="primary" variant="contained" onClick={createRoomButtonPressed}>Create a Room</Button>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button color="secondary" variant="contained" to="/" component={Link}>Back</Button>
                </Grid>
            </Grid>
        );
    }
    let UpdateButtons = () => {
        return (
            <Grid item xs={12} align="center">
              <Button color="primary" variant="contained" onClick={()=>updateButtonPressed()}>Update Room</Button>
            </Grid>
        );
    }

    const title = props.update? "Update Room:" : "Create a Room"
    return (//comes from material-ui
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Collapse in={errorMsg!="" || successMsg!=""}>
                    {successMsg || !errorMsg ? //!errorMsg prevents alert from turning red when closing
                    <Alert severity="success" onClose={() => setSuccessMsg("")}>{successMsg}</Alert>
                    :
                    <Alert severity="error" onClose={() => setErrorMsg("")}>{errorMsg}</Alert>
                    }
                </Collapse>
            </Grid> 
            <Grid item xs={12} align="center">
                <Typography component='h4' variant='h4'>
                    {title}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <FormControl component='fieldset'>
                    <FormHelperText component="span">
                        <div align="center">Guest Control of Playback State</div>
                    </FormHelperText>
                    <RadioGroup row defaultValue={props.guestCanPause.toString()} onChange={handleGuestCanPauseChange} id="radio-group">
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
                        defaultValue={votesToSkip}
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
            {props.update? <UpdateButtons/> : <CreateButtons/> }
        </Grid> 
    );
};
export default CreateRoomPage;