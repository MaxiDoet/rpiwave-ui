import system
from climacell_api.client import ClimacellApiClient

def get_weather_data():
    key = system.get_config_value("weatherApiKey")
    location = system.get_config_value("weatherLocation")

    client = ClimacellApiClient(key)

    return client.realtime(lat=location[0], lon=location[1], fields=['temp', 'weather_code']).json()


