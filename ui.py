from flask import Flask, send_file, url_for, request

import json

import radio

app = Flask("rpiwave-ui", static_folder="web/assets/", static_url_path="/assets")

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


app.run(host= '0.0.0.0', port=80)