# HouseParty
Collaborative music playing app where a host can create a private room to invite other people who can have a say in what music to listen to.

[https://house-party-liang.herokuapp.com/](https://house-party-liang.herokuapp.com/)

## Features
- Private room to host party where guests can join via code
- Play and control music through Spotify API directly in the room
- Hosts must authenticate through Spotify first before setting up room. A premium account is required to control music.
- Hosts have the ability to allow guests to play/pause a song and also number of votes required to skip a song
- Guests can vote to skip a song, though each guest is restricted to voting once
- Users can return to the room they were in if the page is accidentally closed through saved sessions

## Tech
- Django v4
- React v17
- React Router Dom v6
- Spotify API
- Material UI