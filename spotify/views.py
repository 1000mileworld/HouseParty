from email.mime import base
from django.shortcuts import render, redirect
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from .util import update_or_create_user_tokens, is_spotify_authenticated, get_user_tokens
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
    
    #print(response)
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