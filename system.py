import json
import os

# Some system management calls

config_file="userdata/config.json"

def update_config_value(property, value):
    try:
        configFile = open(config_file, "r")
        configOld = json.loads(configFile.read())
        configFile.close()

        configOld[property] = value
        configFile = open(config_file, "w")
        configFile.write(json.dumps(configOld))
        configFile.close()
        return True
    except Exception as ex:
        print(ex)
        return False

def get_config_value(property):
    try:
        configFile = open(config_file, "r")
        value = json.loads(configFile.read())[property]
        configFile.close()
        return value
    except:
        return False

def get_config():
    try:
        configFile = open(config_file, "r")
        return configFile.read()
    except:
        return False

def get_config():
    try:
        configFile = open(config_file, "r")
        return configFile.read()
    except:
        return 0

def shutdown():
    os.system("shutdown -h now")

def dim_down():
    os.system("systemctl start brightness-down")

def dim_normal():
    os.system("systemctl start brightness-normal")

