import vlc
import json

webStations=[]

def playStream(url):
    player = vlc.MediaPlayer(url)
    player.play()

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