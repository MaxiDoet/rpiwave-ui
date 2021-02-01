import json
import random

def get_random_podcasts(count):
    podcast_file = open("podcasts.json", "r")
    podcasts = json.loads(podcast_file.read())["podcasts"]
    random_selection = []

    for i in range(0, count):
        random_number = random.randrange(0, len(podcasts))
        random_selection.append(podcasts[random_number])

    podcast_file.close()
    return json.dumps(random_selection)

def get_data_by_id(id):
    podcast_file = open("podcasts.json", "r")
    podcasts = json.loads(podcast_file.read())["podcasts"]

    for i in range(0, len(podcasts)):
        if (podcasts[i]["id"] == id):
            return json.dumps(podcasts[i])
        else:
            continue

