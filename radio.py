import vlc
import json
from time import sleep
import os

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

"""
playStream("http://br-br3-live.cast.addradio.de/br/br3/live/mp3/mid")
while 1:
    continue
"""