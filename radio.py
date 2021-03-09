import vlc
import json
from time import sleep
import os
from climacell_api.client import ClimacellApiClient

webStations=[]
players=[]

def playStream(url):
    # Wait 1 second or the PulseAudio server will crash!
    sleep(1)

    print("Playing %s" % url)
    player = vlc.MediaPlayer(url)
    players.append(player)
    player.play()

def stopPlayback():
    for player in players:
        player.stop()

def load_webstation_list():
    try:
        webstations_file = open("webstations.json", "r")
        return json.load(webstations_file)
    except:
        return None

def update_config_value(property, value):
    try:
        configFile = open("config.json", "r")
        configOld = json.loads(configFile.read())
        configFile.close()

        configOld[property] = value
        configFile = open("config.json", "w")
        configFile.write(json.dumps(configOld))
        configFile.close()
        return True
    except Exception as ex:
        print(ex)
        return False

def get_config_value(property):
    try:
        configFile = open("config.json", "r")
        value = json.loads(configFile.read())[property]
        configFile.close()
        return value
    except:
        return 0

def get_config():
    try:
        configFile = open("config.json", "r")
        return configFile.read()
    except:
        return 0

def get_weather_data():
    key = get_config_value("weatherApiKey")
    location = get_config_value("weatherLocation")

    client = ClimacellApiClient(key)

    return client.realtime(lat=location[0], lon=location[1], fields=['temp']).json()
