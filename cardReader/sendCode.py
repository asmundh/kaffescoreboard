import requests

API_URL = "http://localhost:3000"

def sendCode(code: str) -> bool:
    req = requests.post(API_URL + "/users/" + code)
    if (req.status_code == 200):
        print("Sent code " + code)
        return True
    else:
        return False
