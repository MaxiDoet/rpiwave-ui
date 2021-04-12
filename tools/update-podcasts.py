import glob
import requests
import random
import json
import sys
import os
from time import time

from pyPodcastParser.Podcast import Podcast
import json

try:
    podcastsFile = open("podcasts-list.json", "r")
    podcasts = json.loads(podcastsFile.read())["podcasts"]
except:
    exit()

dataFile = open("podcasts.json", "w+")
data = {"podcasts": []}

timeTotal=0
timeStart=0
timeEnd=0

for i in range(len(podcasts)):
    timeStart=time()

    response = requests.get(podcasts[i])

    podcast = Podcast(response.content)

    randomId = random.randrange(10000, 100000)

    podcastData = {"name": podcast.title, "id": randomId, "logo": podcast.itune_image, "description": podcast.description, "episodes": []}

    for i in range(0, len(podcast.items)):
        episodeData = {"title": podcast.items[i].title, "stream": podcast.items[i].enclosure_url, "number": len(podcast.items) - i}
        podcastData["episodes"].append(episodeData)


    data["podcasts"].append(podcastData)

    # Scan local files
    podcastData = {"name": "Local Files", "id": randomId, "logo": '', "description": "Local Files", "episodes": []}

"""
    local_files = glob.glob("../userdata/local/*.mp3*")
    for file in local_files:
	episodeData = {"title": file, "stream": "/local"
"""

    timeEnd=time()
    timeTotal+=timeEnd-timeStart

report = {"time": timeTotal, "count": len(podcasts)}

dataFile.write(json.dumps(data, indent=4))
dataFile.close()

#print(report)

os.system("cp /home/pi/rpiwave-ui/tools/podcasts.json /home/pi/rpiwave-ui/userdata/podcasts.json")
