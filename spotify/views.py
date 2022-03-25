from django.shortcuts import render, redirect
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from .util import *
from api.models import Room
from requests import Request, post

import os
import base64

CLIENT_ID = os.getenv('CLIENT_ID')
CLIENT_SECRET = os.getenv('CLIENT_SECRET')
REDIRECT_URI = os.getenv('REDIRECT_URI')

class AuthURL(APIView):
    def get(self,request,format=None): #front end will call this to get url
        #info to access from spotify (from doc)
        scopes = 'user-read-playback-state user-modify-playback-state user-read-currently-playing'
        url = Request('GET','https://accounts.spotify.com/authorize',params={
            'scope': scopes,
            'response_type': 'code',
            'redirect_uri': REDIRECT_URI,
            'client_id': CLIENT_ID,
        }).prepare().url
        
        return Response({'url': url}, status=status.HTTP_200_OK) #front end receives url and redirects there

#going to url above will redirect to here (redirect by spotify, entered redirect url in app settings)
def spotify_callback(request,format=None): 
    code = request.GET.get('code')
    error = request.GET.get('error')
    
    client_creds = f'{CLIENT_ID}:{CLIENT_SECRET}'
    client_creds_64 = base64.b64encode(client_creds.encode()) #.encode makes string into bytes
    token_data = {
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': REDIRECT_URI, #used to match the one supplied when authorizing url above
    }
    token_header = {
        'Authorization': f'Basic {client_creds_64.decode()}', #need to decode, can't have bytes in a string
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    
    #send request for tokens
    response = post('https://accounts.spotify.com/api/token', data=token_data, headers=token_header).json()
    
    print('Authorization token POST response')
    print(response)
    
    access_token = response.get('access_token') #store tokens
    token_type = response.get('token_type')
    refresh_token = response.get('refresh_token')
    expires_in = response.get('expires_in')
    error = response.get('error')

    if not request.session.exists(request.session.session_key):
        request.session.create()

    update_or_create_user_tokens(
        request.session.session_key, access_token, token_type, expires_in, refresh_token)

    return redirect('frontend:home') #redirect back to original app (empty after colon means home page)
    #make sure to specify app_name in frontend's urls.py and name in path

class IsAuthenticated(APIView):
    def get(self, request, format=None):
        is_authenticated = is_spotify_authenticated(
            self.request.session.session_key)
        return Response({'status': is_authenticated}, status=status.HTTP_200_OK)

class CurrentSong(APIView):
    def get(self, request, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)
        if room.exists():
            room = room[0]
        else:
            return Response({}, status=status.HTTP_404_NOT_FOUND)
        host = room.host
        endpoint = "player/currently-playing"
        response = execute_spotify_api_request(host, endpoint)
        
        if 'error' in response or 'item' not in response: #if no song playing in spotify, just show blank
            return Response({}, status=status.HTTP_204_NO_CONTENT)
        
        item = response.get('item')
        duration = item.get('duration_ms')
        progress = response.get('progress_ms')
        album_cover = item.get('album').get('images')[0].get('url') #[0] is the largest image
        is_playing = response.get('is_playing')
        song_id = item.get('id')

        artist_string = ""

        #handle multiple artists for a song
        for i, artist in enumerate(item.get('artists')):
            if i > 0:
                artist_string += ", "
            name = artist.get('name')
            artist_string += name

        song = {
            'title': item.get('name'),
            'artist': artist_string,
            'duration': duration,
            'time': progress,
            'image_url': album_cover,
            'is_playing': is_playing,
            'votes': 0,
            'id': song_id
        }

        return Response(song, status=status.HTTP_200_OK)

class PauseSong(APIView):
    def put(self, response, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)[0]
        if self.request.session.session_key == room.host or room.guest_can_pause:
            pause_song(room.host)
            return Response({}, status=status.HTTP_204_NO_CONTENT)
        
        return Response({}, status=status.HTTP_403_FORBIDDEN)

class PlaySong(APIView):
    def put(self, response, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)[0]
        if self.request.session.session_key == room.host or room.guest_can_pause:
            play_song(room.host)
            return Response({}, status=status.HTTP_204_NO_CONTENT)
        
        return Response({}, status=status.HTTP_403_FORBIDDEN)