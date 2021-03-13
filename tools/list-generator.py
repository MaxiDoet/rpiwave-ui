import requests
import random
import json
import sys

from pyPodcastParser.Podcast import Podcast
import json

try:
    podcastsFile = open("podcasts-list.json", "r")
    podcasts = json.loads(podcastsFile.read())["podcasts"]
    print("Found %s podcasts to add" % len(podcasts))
except:
    exit()

dataFile = open("podcasts.json", "w+")
data = {"podcasts": []}

for i in range(len(podcasts)):

    sys.stdout.write("%s/%s" % (i+1, len(podcasts)))
    sys.stdout.flush()

    response = requests.get(podcasts[i])

    podcast = Podcast(response.content)

    randomId = random.randrange(10000, 100000)

    podcastData = {"name": podcast.title, "id": randomId, "logo": podcast.itune_image, "description": podcast.description, "episodes": []}

    for i in range(0, len(podcast.items)):
        episodeData = {"title": podcast.items[i].title, "stream": podcast.items[i].enclosure_url, "number": len(podcast.items) - i}
        podcastData["episodes"].append(episodeData)

    data["podcasts"].append(podcastData)

    sys.stdout.write("     Done\n")

dataFile.write(json.dumps(data, indent=4))
dataFile.close()

