from turtle import pos
import requests
import random
import json
from faker import Faker
from faker.providers import lorem
from firebase_admin import auth
import firebase_admin
import json
from dotenv import load_dotenv
import time
import os
from datetime import datetime
import ast

# Load environment variables from .env file
# without overwriting existing ones
load_dotenv()

# credentials for firebase
# are stored in an environment variable called GOOGLE_APPLICATION_CREDENTIALS

faker = Faker()
faker.add_provider(lorem)

firebase_app = firebase_admin.initialize_app()
api_key = os.environ.get('FIREBASE_API_KEY')


def get_admin_id_token():
    admin_user = auth.get_user_by_email('iulian.cernat98@gmail.com', firebase_app)
    admin_custom_id_token = auth.create_custom_token(admin_user.uid).decode('utf8')

    # Exchange custom token for an id token
    firebase_rest_api_request_result = requests.post(
        f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key={api_key}",
        data={'token': admin_custom_id_token, 'returnSecureToken': True}
    )
    id_token = firebase_rest_api_request_result.json()['idToken']
    return id_token


api_path_base_url = 'http://127.0.0.1:5000/api'

student_groups = ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6']


def delete_firebase_users():
    with open('firebaseUsersUIDS.txt') as f:
        content = f.read()
        content = content.replace("\n", "")
        uid_list = ast.literal_eval(content)
        auth.delete_users(uid_list)


def create_profiles(profile_list, headers):
    uid_list = []

    api_path = api_path_base_url + '/firebase_users/'
    teacher_profiles = profile_list[:1]
    student_profiles = profile_list[1:]
    created_teachers_ids = []
    created_students_ids = []
    for profile in teacher_profiles:
        time.sleep(2)
        post_request_data = {
            'fullName': profile['name'],
            'email': profile['email'],
            'contact': profile['email'],
            'is_user_teacher': True,
            'firebase_claims': {'teacher': True}

        }
        if profile['photo']:
            post_request_data['avatar_url'] = profile['photo']
        response = requests.post(api_path, json=post_request_data, headers=headers)
        created_profile = response.json()
        created_teachers_ids.append(int(created_profile['id']))

        uid_list.append(created_profile['uid'])

    for profile in student_profiles:
        time.sleep(2)
        post_request_data = {
            'fullName': profile['name'],
            'email': profile['email'],
            'contact': profile['email'],
            'is_user_student': True,
            'student_group': random.choice(student_groups),
            'firebase_claims': {}

        }
        if profile['photo']:
            post_request_data['avatar_url'] = profile['photo']
        response = requests.post(
            api_path, json=post_request_data, headers=headers)
        created_profile = response.json()
        created_students_ids.append(int(created_profile['id']))
        uid_list.append(created_profile['uid'])

    return created_teachers_ids, created_students_ids, uid_list


def create_projects(teacher_ids, headers):
    api_path = api_path_base_url + "/projects/"
    projects_created_by_users = []
    for user_id in teacher_ids:
        created_projects_ids = []
        for _ in range(0, 4):
            post_request_data = {
                'name': faker.text()[:255],
                'description': faker.text(max_nb_chars=2000),
                'created_at': datetime.now().isoformat(),
                'product_owner_id': user_id
            }
            response = requests.post(api_path, json=post_request_data, headers=headers)
            created_projects_ids.append(
                int(response.json()['id']))
        projects_created_by_users.append(
            {'project_creator': user_id, 'created_projects': created_projects_ids})

    return projects_created_by_users


def create_teams(projects_created_by_users, users_ids, headers):
    api_path = api_path_base_url + "/teams/"
    projects_with_teams = []
    for projects_by_user in projects_created_by_users:
        project_creator_id = projects_by_user['project_creator']
        for project_id in projects_by_user['created_projects']:
            teams_for_project = []
            for _ in range(random.randint(2, 3)):
                if len(users_ids) == 0:
                    return

                scrum_master_id = random.choice(users_ids)
                users_ids.remove(scrum_master_id)
                post_request_data = {
                    'name': faker.text()[:255],
                    'description': faker.text(max_nb_chars=2000),
                    'created_at': datetime.now().isoformat(),
                    'project_id': project_id,
                    'scrum_master_id': scrum_master_id
                }
                response = requests.post(api_path, json=post_request_data,  headers=headers)

                response_json = response.json()

                teams_for_project.append(
                    {
                        'team_id': int(response_json['id']),
                        'scrum_master_id': scrum_master_id,
                    }
                )
            projects_with_teams.append(
                {
                    'project_id': project_id,
                    'product_owner_id': project_creator_id,
                    'teams': teams_for_project
                })

    return projects_with_teams


def add_team_members(projects_with_teams, users_ids, headers):
    api_path = api_path_base_url + "/teams_members/"
    for project_with_team in projects_with_teams:
        for team in project_with_team['teams']:
            if len(users_ids) == 0:
                return
            team_members_ids = random.sample(users_ids, random.randint(0, len(users_ids)//3))
            for team_member_id in team_members_ids:
                users_ids.remove(team_member_id)

            post_request_data = {
                'team_members': [
                    {
                        'user_id': team_member_id,
                        'team_id': team['team_id'],
                        'user_type': 'developer',
                        'created_at': datetime.now().isoformat()
                    }
                    for team_member_id in
                    team_members_ids]

            }

            requests.post(api_path, json=post_request_data,  headers=headers)


def generate_issues(projects_with_teams, headers):
    api_path = api_path_base_url + "/issues/"
    created_issues_for_projects = []
    for project_with_teams in projects_with_teams:
        for team in project_with_teams['teams']:
            project_issues = {
                'project_id': project_with_teams['project_id'],
                'project_scrum_master_id': team['scrum_master_id'],
                'issues_ids': []
            }
            for _ in range(20):
                post_request_data = {
                    'title': faker.text()[:255],
                    'description': faker.text(max_nb_chars=1000),
                    'type': random.choice(['story', 'bug', 'task']),
                    'priority': str(random.randint(1, 5)),
                    'created_at': datetime.now().isoformat(),
                    'project_id': project_with_teams['project_id'],
                    'creator_user_id': team['scrum_master_id']
                }
                response = requests.post(api_path, json=post_request_data,  headers=headers)
                response_json = response.json()
                project_issues['issues_ids'].append(
                    int(response_json['id'])
                )
            created_issues_for_projects.append(project_issues)

    return created_issues_for_projects


def generate_sprints(projects_issues, headers):
    api_path = api_path_base_url + "/sprints/"

    projects = []
    for project_with_issues in projects_issues:
        try:
            found_project = next(
                filter(lambda item: next(iter(item.keys())) == project_with_issues['project_id'],
                       projects))
            project_id_key = next(iter(found_project.keys()))

            found_project[project_id_key]['scrum_masters'].append(
                project_with_issues['project_scrum_master_id'])
            found_project[project_id_key]['issues_ids'].extend(
                project_with_issues['issues_ids'])
        except StopIteration:
            projects.append({project_with_issues['project_id']: {
                'scrum_masters': [project_with_issues['project_scrum_master_id']],
                'issues_ids': project_with_issues['issues_ids']
            }})

    for project in projects:
        for _ in range(1, 4):
            project_id_key = project_id_key = next(iter(project.keys()))
            try:
                if len(project[project_id_key]['issues_ids']) < 6:
                    break

                chosen_scrum_master = random.choice(
                    project[project_id_key]['scrum_masters'])
                chosen_issues = random.choices(
                    project[project_id_key]['issues_ids'], k=random.randint(4, 8))
                post_request_data = {
                    'name': faker.text()[:255],
                    'start_date': "2021-06-16T10:31:06.035Z",
                    'duration': "1",
                    'end_date': "2021-06-16T10:31:06.035Z",
                    'goal': faker.text(max_nb_chars=2000),
                    'created_at': datetime.now().isoformat(),
                    'issues_ids': chosen_issues,
                    "user_creator_id": chosen_scrum_master,
                    "project_id": project_id_key
                }
                requests.post(api_path, json=post_request_data,  headers=headers)

            except Exception as e:
                print(e)


if __name__ == '__main__':
    # delete_firebase_users()
    admin_id_token = get_admin_id_token()
    headers = {'Authorization': f'firebase_id_token={admin_id_token}'}
    with open('profiles.json') as f:
        profiles = json.load(f)

    created_teachers_ids, created_students_ids, uidList = create_profiles(profiles, headers)
    with open('firebaseUsersUIDS.txt', 'w') as f:
        f.write(uidList.__repr__())

    print("generated profiles")
    projects = create_projects(created_teachers_ids, headers)
    print("generated projects")
    projects_with_teams = create_teams(projects, created_students_ids, headers)
    print("generated teams")
    add_team_members(projects_with_teams, created_students_ids, headers)
    print("generated team members")
    issues = generate_issues(projects_with_teams, headers)
    print("generated issues")
    generate_sprints(issues, headers)
    print("generated sprints")
