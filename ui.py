from flask import Flask, send_file, url_for, request

import json

import radio
import podcast

app = Flask("rpiwave-ui", static_folder="web/assets/", static_url_path="/assets")


def status(success):
    if success: 
        return '{"status": "success"}' 
    else:
         return '{"status": "error"}'

@app.route('/')
def index():
    return send_file("web/index.html")


@app.route('/api/get_station_list')
def get_station_list():
    return json.dumps(radio.load_webstation_list())


@app.route('/api/play_stream')
def play_stream():
    url = request.args.get('url')
    if not url: return "No url!"

    radio.playStream(url)
    return ""


@app.route('/api/stop_playback')
def stop_playback():
    radio.stopPlayback()
    return ""

@app.route('/api/update_config_value')
def update_config_value():
    property = request.args.get("property")
    new_value = request.args.get("value")

    if radio.update_config_value(property, new_value):
        return status(True)
    else:
        return status(False)

@app.route('/api/get_config_value')
def get_config_value():
    property = request.args.get("property")
    return radio.get_config_value(property)

@app.route('/api/get_config')
def get_config():
    return radio.get_config()

@app.route('/api/get_random_podcasts')
def get_random_podcasts():
    count = request.args.get("count")

    return podcast.get_random_podcasts(int(count))

@app.route('/api/get_podcast_data_by_id')
def get_podcast_data_by_id():
    id = request.args.get("id")

    return podcast.get_data_by_id(id)

@app.route('/api/shutdown')
def shutdown():
    radio.shutdown()
    
    return True

@app.route('/api/dim_down')
def dim_down():
    radio.dim_down()
    
    return True

@app.route('/api/dim_normal')
def dim_normal():
    radio.dim_normal()
    
    return True

app.run(host= '0.0.0.0', port=80)