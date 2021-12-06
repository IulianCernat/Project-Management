import requests
import time
import json
from faker import Faker
from faker.providers import profile

# your uifaces api key
headers = {
	'X-API-KEY': '',
	'Accept': 'application/json',
	'Cache-Control': 'no-cache'
}
base_url = 'https://uifaces.co/api'

faker = Faker()
faker.add_provider(profile)

profiles = []

for _ in range(4):
	response = requests.get(base_url, headers=headers)
	responseJson = response.json()
	profiles.extend(responseJson)
	time.sleep(2)

# generate more profiles
extra_profiles = []
for _ in range(15):
	profile = faker.simple_profile()
	extra_profiles.append({
		'name': profile['name'],
		'email': profile['mail'],
		'photo': None
	})
profiles.extend(extra_profiles)

unique_profiles = []
for profile in profiles:
	if profile['name'] not in [unique_profile['name'] for unique_profile in unique_profiles]:
		unique_profiles.append(profile)

with open('profiles.json', 'w') as profilesOutputFile:
	json.dump(unique_profiles, profilesOutputFile)