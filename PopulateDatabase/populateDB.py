import requests
import random
import json
from faker import Faker

faker = Faker()
api_path_base_url = 'http://192.168.1.2:5000/api'


def create_profiles(profile_list):
    api_path = api_path_base_url + '/users/'
    created_users_ids = []
    for profile in profile_list:
        post_request_data = {
            'fullName': profile['name'],
            'avatar_url': profile['photo'],
            'contact': profile['email']
        }
        response = requests.post(api_path, json=post_request_data)
        created_users_ids.append(int(response.json()['location'].split("/")[-1]))

    return created_users_ids


def create_projects(users_ids):
    api_path = api_path_base_url + "/projects/"
    projects_created_by_users = []
    for user_id in users_ids:
        created_projects_ids = []
        for _ in range(random.randint(0, 6)):
            post_request_data = {
                'name': faker.text()[:255],
                'description': faker.text(),
                'created_at': "2021-06-15T17:57:32.585Z",
                'product_owner_id': user_id
            }
            response = requests.post(api_path, json=post_request_data)
            created_projects_ids.append(int(response.json()['location'].split("/")[-1]))
        projects_created_by_users.append({'project_creator': user_id, 'created_projects': created_projects_ids})

    return projects_created_by_users


def create_teams(projects_created_by_users, users_ids):
    api_path = api_path_base_url + "/teams/"
    created_teams_with_scrum_masters = []
    for projects_by_user in projects_created_by_users:
        project_creator_id = projects_by_user['project_creator']

        for project_id in projects_by_user['created_projects']:
            already_added_scrum_masters = []

            for _ in range(0, 6):
                possible_scrum_masters = list(
                    filter(lambda item: item != project_creator_id and item not in already_added_scrum_masters, users_ids))
                scrum_master_id = random.choice(possible_scrum_masters)
                already_added_scrum_masters.append(scrum_master_id)
                post_request_data = {
                    'name': faker.text()[:255],
                    'description': faker.text(),
                    'created_at': "2021-06-15T18:26:18.970Z",
                    'project_id': project_id,
                    'scrum_master_id': scrum_master_id
                }
                response = requests.post(api_path, json=post_request_data)

                response_json = response.json()

                created_teams_with_scrum_masters.append(
                    {

                        'team_id': int(response_json['location'].split("/")[-1]),
                        'scrum_master_id': scrum_master_id,
                        'product_owner_id': project_creator_id
                    }
                )
    return created_teams_with_scrum_masters


def add_team_members(teams, users_ids):
    api_path = api_path_base_url + "/teams_members/"
    for team in teams:
        possible_team_members = list(
            filter(lambda user_id: user_id not in [team['scrum_master_id'], team['product_owner_id']], users_ids))
        print(team['team_id'])
        team_members_ids = random.sample(possible_team_members, random.randint(1, 3))
        post_request_data = {
            'team_members': [{'user_id': team_member_id,
                              'team_id': team['team_id'],
                              'user_type': 'developer',
                              'created_at': "2021-06-15T19:04:58.263Z"} for team_member_id in team_members_ids]

        }

        response = requests.post(api_path, json=post_request_data)



if __name__ == '__main__':
    with open('profiles.json') as f:
        profiles = json.load(f)

    created_users_ids = create_profiles(profiles)
    created_users_ids.append(385)
    random.shuffle(created_users_ids)
    print("generated profiles")
    projects = create_projects(created_users_ids)
    print("generated projects")
    teams = create_teams(projects, created_users_ids)
    print(teams)
    print("generated teams")
    print(teams)
    add_team_members(teams, created_users_ids)
    print("generated team members")