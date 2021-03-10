from flask import Flask, send_file, url_for, request

import json

import system
import webstation
import podcast
import weather

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
	webstations = json.dumps(webstation.get_webstation_list())

	if (webstations):
		return webstations
	else:
		return status(False)

@app.route('/api/play_stream')
def play_stream():
    url = request.args.get('url')
    if not url: return status(False)

    webstation.playStream(url)
    return status(True)


@app.route('/api/stop_playback')
def stop_playback():
    webstation.stopPlayback()
    return status(True)

@app.route('/api/update_config_value')
def update_config_value():
    property = request.args.get("property")
    new_value = request.args.get("value")

    if system.update_config_value(property, new_value):
        return status(True)
    else:
        return status(False)

@app.route('/api/get_config_value')
def get_config_value():
	property = request.args.get("property")
	value = system.get_config_value(property)

	if value:
		return radio.get_config_value(property)
	else:
		return status(False)

@app.route('/api/get_config')
def get_config():
	config = system.get_config()

	if config:
		return config
	else:
		return status(False)

@app.route('/api/get_random_podcasts')
def get_random_podcasts():
	count = request.args.get("count")
	if not count: return status(False)

	return podcast.get_random_podcasts(int(count))

@app.route('/api/get_podcast_data_by_id')
def get_podcast_data_by_id():
	id = request.args.get("id")
	if not id: return status(False)

	data = podcast.get_data_by_id(id)

	if data:
		return data
	else:
		return status(False)

@app.route('/api/shutdown')
def shutdown():
    system.shutdown()
    return status(True)

@app.route('/api/dim_down')
def dim_down():
    system.dim_down()

    return status(True)

@app.route('/api/dim_normal')
def dim_normal():
    system.dim_normal()
    return status(True)

@app.route('/api/get_weather_data')
def get_weather_data():
	data = weather.get_weather_data()
	if not data: return status(False)

	return data

app.run(host= '0.0.0.0', port=80)
