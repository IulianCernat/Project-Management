import requests
import random
import json
from faker import Faker
from faker.providers import lorem

faker = Faker()
faker.add_provider(lorem)

# Firebase authorization check must be disabled in code for creating profiles
api_path_base_url = 'http://127.0.0.1:5000/api'


def create_profiles(profile_list):
    api_path = api_path_base_url + '/users/'
    created_users_ids = []
    for profile in profile_list:
        post_request_data = {
            'fullName': profile['name'],
            'contact': profile['email']
        }
        if profile['photo']:
            post_request_data['avatar_url'] = profile['photo']
        response = requests.post(api_path, json=post_request_data)
        created_users_ids.append(
            int(response.json()['location'].split("/")[-1]))

    return created_users_ids


def create_projects(users_ids):
    api_path = api_path_base_url + "/projects/"
    projects_created_by_users = []
    for user_id in users_ids:
        created_projects_ids = []
        for _ in range(random.randint(0, 6)):
            post_request_data = {
                'name': faker.text()[:255],
                'description': faker.text(max_nb_chars=2000),
                'created_at': "2021-06-15T17:57:32.585Z",
                'product_owner_id': user_id
            }
            response = requests.post(api_path, json=post_request_data)
            created_projects_ids.append(
                int(response.json()['location'].split("/")[-1]))
        projects_created_by_users.append(
            {'project_creator': user_id, 'created_projects': created_projects_ids})

    return projects_created_by_users


def create_teams(projects_created_by_users, users_ids):
    api_path = api_path_base_url + "/teams/"
    projects_with_teams = []
    for projects_by_user in projects_created_by_users:

        project_creator_id = projects_by_user['project_creator']

        for project_id in projects_by_user['created_projects']:
            already_added_scrum_masters = []
            teams_for_project = []
            for _ in range(6):
                possible_scrum_masters = list(
                    filter(lambda item: item != project_creator_id and item not in already_added_scrum_masters,
                           users_ids))
                scrum_master_id = random.choice(possible_scrum_masters)
                already_added_scrum_masters.append(scrum_master_id)
                post_request_data = {
                    'name': faker.text()[:255],
                    'description': faker.text(max_nb_chars=2000),
                    'created_at': "2021-06-15T18:26:18.970Z",
                    'project_id': project_id,
                    'scrum_master_id': scrum_master_id
                }
                response = requests.post(api_path, json=post_request_data)

                response_json = response.json()

                teams_for_project.append(
                    {
                        'team_id': int(response_json['location'].split("/")[-1]),
                        'scrum_master_id': scrum_master_id,
                    }
                )
            projects_with_teams.append({'project_id': project_id,
                                        'product_owner_id': project_creator_id,
                                        'teams': teams_for_project
                                        })
    return projects_with_teams


def add_team_members(projects_with_teams, users_ids):
    api_path = api_path_base_url + "/teams_members/"
    for project_with_team in projects_with_teams:
        already_added_members = []
        already_added_scrum_masters = [
            team['scrum_master_id'] for team in project_with_team['teams']]
        for team in project_with_team['teams']:
            possible_team_members = list(
                filter(lambda user_id: user_id != project_with_team['product_owner_id']
                       and user_id not in already_added_members
                       and user_id not in already_added_scrum_masters,
                       users_ids))

            team_members_ids = random.sample(
                possible_team_members, random.randint(1, 8))

            already_added_members.extend(team_members_ids)
            post_request_data = {
                'team_members': [{'user_id': team_member_id,
                                  'team_id': team['team_id'],
                                  'user_type': 'developer',
                                  'created_at': "2021-06-15T19:04:58.263Z"} for team_member_id in team_members_ids]

            }

            response = requests.post(api_path, json=post_request_data)


def generate_issues(projects_with_teams):
    api_path = api_path_base_url + "/issues/"
    created_issues_for_projects = []
    for project_with_teams in projects_with_teams:
        for team in project_with_teams['teams']:
            project_issues = {'project_id': project_with_teams['project_id'],
                              'project_scrum_master_id': team['scrum_master_id'],
                              'issues_ids': []}
            for _ in range(5):
                post_request_data = {
                    'title': faker.text()[:255],
                    'description': faker.text(max_nb_chars=1000),
                    'type': random.choice(['story', 'bug', 'task']),
                    'priority': str(random.randint(1, 5)),
                    'created_at': "2021-06-16T09:45:44.633Z",
                    'project_id': project_with_teams['project_id'],
                    'creator_user_id': team['scrum_master_id']
                }
                response = requests.post(api_path, json=post_request_data)
                response_json = response.json()
                project_issues['issues_ids'].append(
                    int(response_json['location'].split("/")[-1])
                )
            created_issues_for_projects.append(project_issues)

    return created_issues_for_projects


def generate_sprints(projects_issues):
    api_path = api_path_base_url + "/sprints/"

    projects = []
    for project_with_issues in projects_issues:
        try:
            found_project = next(
                filter(lambda item: next(iter(item.keys())) == project_with_issues['project_id'], projects))
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
                    'created_at': "2021-06-16T10:31:06.035Z",
                    'issues_ids': chosen_issues,
                    "user_creator_id": chosen_scrum_master,
                    "project_id": project_id_key
                }
                requests.post(api_path, json=post_request_data)

            except Exception as e:
                print(e)


if __name__ == '__main__':
    with open('profiles.json') as f:
        profiles = json.load(f)

    created_users_ids = create_profiles(profiles)
    created_users_ids.append(1)
    random.shuffle(created_users_ids)
    print("generated profiles")
    projects = create_projects(created_users_ids)
    print("generated projects")
    projects_with_teams = create_teams(projects, created_users_ids)
    print("generated teams")
    add_team_members(projects_with_teams, created_users_ids)
    print("generated team members")
    issues = generate_issues(projects_with_teams)
    print("generated issues")
    generate_sprints(issues)
    print("generated sprints")
