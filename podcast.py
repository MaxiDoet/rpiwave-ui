import json
import random

podcasts_file="userdata/podcasts.json"

def get_random_podcasts(count):
    podcast_file = open(podcasts_file, "r")
    podcasts = json.loads(podcast_file.read())["podcasts"]
    random_selection = []


    random_numbers=random.sample(range(len(podcasts) - 1), count)

    for i in random_numbers:
        random_selection.append(podcasts[i])

    podcast_file.close()
    return json.dumps(random_selection)

def get_data_by_id(id):
    podcast_file = open(podcasts_file, "r")
    podcasts = json.loads(podcast_file.read())["podcasts"]

    for i in range(0, len(podcasts)):
        if (podcasts[i]["id"] == id):
            return json.dumps(podcasts[i])
        else:
            continue

    return ""

