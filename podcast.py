import json
import random

podcasts_file="userdata/podcasts.json"

def get_random_podcasts(count):
    podcast_file = open(podcasts_file, "r")
    podcasts = json.loads(podcast_file.read())["podcasts"]
    random_selection = []

    for i in range(count):
        random_number = random.randint(0, len(podcasts) - 1)

        for i2 in random_selection:
            print("random_random: %s" % random_number)
            if i2 == podcasts[random_number]:
                i-=1
                break

        random_selection.append(podcasts[random_number])

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

