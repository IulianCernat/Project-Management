import subprocess

# Connect to a proxy server in order to test trello callbacks
subdomain = "tunneled_api"
subprocess.run(f"py -m jprq http 8000 -s={subdomain}")
