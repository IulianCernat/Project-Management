import requests
import time
import json

# your uifaces api key
headers = {'X-API-KEY': '',
           'Accept': 'application/json',
           'Cache-Control': 'no-cache'}
base_url = 'https://uifaces.co/api'

profiles = []

for _ in range(4):
    response = requests.get(base_url, headers=headers)
    responseJson = response.json()
    profiles.extend(responseJson)
    time.sleep(2)

unique_profiles = []
for profile in profiles:
    if profile['name'] not in [unique_profile['name'] for unique_profile in unique_profiles]:
        unique_profiles.append(profile)

with open('profiles.json', 'w') as profilesOutputFile:
    json.dump(unique_profiles, profilesOutputFile)