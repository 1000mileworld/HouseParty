from rest_framework import serializers
from .models import Room

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = '__all__'

class CreateRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ('guest_can_pause','votes_to_skip')

class UpdateRoomSerializer(serializers.ModelSerializer):
    #every time code passed in will already belong to a room so it's not 'unique'
    #updating a code means it already exists
    #redefine code field so it doesn't have to be unique
    code = serializers.CharField(validators=[])
    class Meta:
        model = Room
        fields = ('guest_can_pause','votes_to_skip','code')