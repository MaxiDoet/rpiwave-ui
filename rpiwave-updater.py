import sys
import subprocess
import os

CMD_GIT_LOCALVERSION=["git", "rev-parse", "HEAD"]
CMD_GIT_LOCALVERSION_SHORT=["git", "rev-parse", "--short", "HEAD"]
CMD_GIT_VERSION=["git", "ls-remote", "-q", "--refs"]

def get_localversion():
	return subprocess.check_output(CMD_GIT_LOCALVERSION).decode().strip("\n")

def get_localversion_short():
	return subprocess.check_output(CMD_GIT_LOCALVERSION_SHORT).decode().strip("\n")

def get_version():
	return subprocess.check_output(CMD_GIT_VERSION).decode().strip("\nmain/refs/head")

# Parse arguments
action=None
try:
	action = sys.argv[1]
except IndexError:
	print("No commands!")
	exit(1)

if action=="localversion":
	print(get_localversion())

elif action=="localversion_short":
	print(get_localversion_short())

elif action=="version":
	print(get_version())

elif action=="update":
	os.system("git pull")

else:
	print("Unknown Command!")
