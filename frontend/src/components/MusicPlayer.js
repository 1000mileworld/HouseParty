import React, { useState } from "react";
import { Grid, Typography, Card, IconButton, LinearProgress } from "@material-ui/core";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import SkipNextIcon from "@material-ui/icons/SkipNext";

const defaultTitle = "Unknown Title";
const defaultArtist = "Unknown Artist";
const defaultImage_url = "https://n-magazine.com/wp-content/uploads/2021/04/spotify-icon-green-logo-8.png";

function MusicPlayer(props) {
    const skipSong = () => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        };
        fetch("/spotify/skip", requestOptions);
    }

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
              <img src={props.image_url || defaultImage_url} height="100%" width="100%" />
            </Grid>
            <Grid item align="center" xs={8}>
              <Typography component="h5" variant="h5">
                {props.title || defaultTitle}
              </Typography>
              <Typography color="textSecondary" variant="subtitle1">
                {props.artist || defaultArtist}
              </Typography>
              <div>
                <IconButton onClick={() => {
                  props.is_playing ? pauseSong() : playSong();
                }}>
                  {props.is_playing ? <PauseIcon /> : <PlayArrowIcon />}
                </IconButton>
                <IconButton onClick={() => skipSong()}>
                  <SkipNextIcon />
                </IconButton> 
                {`(${props.votes || 0} / ${props.votes_required || 0} skip votes)`}
              </div>
            </Grid>
          </Grid>
          <LinearProgress variant="determinate" value={songProgress} />
        </Card>
    );
}

export default MusicPlayer;