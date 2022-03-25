import React, { useState } from "react";
import { Grid, Typography, Card, IconButton, LinearProgress } from "@material-ui/core";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import SkipNextIcon from "@material-ui/icons/SkipNext";

function MusicPlayer(props) {
    const pauseSong = () => {
        const requestOptions = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
        };
         fetch("/spotify/pause", requestOptions);
    }

    const playSong = () => {
        const requestOptions = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
        };
        fetch("/spotify/play", requestOptions);
    }

    const songProgress = (props.time / props.duration) * 100;
    return (
        <Card>
          <Grid container alignItems="center">
            <Grid item align="center" xs={4}>
              <img src={props.image_url} height="100%" width="100%" />
            </Grid>
            <Grid item align="center" xs={8}>
              <Typography component="h5" variant="h5">
                {props.title}
              </Typography>
              <Typography color="textSecondary" variant="subtitle1">
                {props.artist}
              </Typography>
              <div>
                <IconButton onClick={() => {
                  props.is_playing ? pauseSong() : playSong();
                }}>
                  {props.is_playing ? <PauseIcon /> : <PlayArrowIcon />}
                </IconButton>
                <IconButton>
                  <SkipNextIcon />
                </IconButton>
              </div>
            </Grid>
          </Grid>
          <LinearProgress variant="determinate" value={songProgress} />
        </Card>
    );
}

export default MusicPlayer;