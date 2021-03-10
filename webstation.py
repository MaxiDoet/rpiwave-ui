import json

webstations_file = "userdata/webstations.json"

def play_stream(url):
    # Wait 1 second or the PulseAudio server will crash!
    sleep(1)

    print("Playing %s" % url)
    player = vlc.MediaPlayer(url)
    players.append(player)
    player.play()

def stop_playback():
    for player in players:
        player.stop()

def get_webstation_list():
	try:
		fp = open(webstations_file, "r")
		return json.loads(fp.read())
	except:
		print("Couldn't find webstations file!")
		return False
