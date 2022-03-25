import React, { useState, useEffect } from "react";
import { Grid, Button, Typography, IconButton } from "@material-ui/core";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import { Link } from "react-router-dom";

const pages = {
  JOIN: "pages.join",
  CREATE: "pages.create",
};

export default function AppInfo(props) {
  const [page, setPage] = useState(pages.JOIN);
  const [dummy, setDummy] = useState(false)

  function joinInfo() {
    return "House party creates a private space for people to get together virtually and listen to their favorite music. If there's an ongoing party you want to join, just ask your host for the room code. If you don't like the song being played, vote to skip it!";
  }

  function createInfo() {
    return "To host a house party, you must have a Spotify account to play music and a premium acount to control the music using play/pause on this app. A host can also set allowed guest behavior such as play/pause and number of votes needed to skip a song.";
  }

//   useEffect(() => {
//     //setDummy(true)
//     console.log("ran"); //component mounted
//     return () => console.log("cleanup"); //component will unmount
//   });

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Typography component="h4" variant="h4">
          What is House Party?
        </Typography>
      </Grid>
      <Grid item xs={12} align="center" className="info-box">
        <Typography variant="body1">
          {page === pages.JOIN ? joinInfo() : createInfo()}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <IconButton
          onClick={() => {
            page === pages.CREATE ? setPage(pages.JOIN) : setPage(pages.CREATE);
          }}
        >
          {page === pages.CREATE ? (
            <NavigateBeforeIcon />
          ) : (
            <NavigateNextIcon />
          )}
        </IconButton>
      </Grid>
      <Grid item xs={12} align="center">
        <Button color="secondary" variant="contained" to="/" component={Link}>
          Back
        </Button>
      </Grid>
    </Grid>
  );
}