import subprocess
import random
import string
# Connect to a proxy server in order to test trello callbacks
# '.join(random.choices(
#     string.ascii_uppercase + string.digits, k=10))
random_string = 'q62h9abghr'

subdomain = f"tunneled_api_{random_string}"
subprocess.run(f"py -m jprq http 5000 -s={subdomain}")
