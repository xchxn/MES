import requests

# Define the URL of the FastAPI endpoint
url = 'http://127.0.0.1:8000/predict'

# Define the payload (input data) for the POST request
payload = {
    "관리구분": "고구마",
    "품목": "일반고구마",
    "품종": "소담미",
    "등급": "종자용",
    "n": 10
}

# Send the POST request
response = requests.post(url, json=payload)

# Check the response status code
if response.status_code == 200:
    # Print the JSON response
    print("Predictions:")
    print(response.json())
else:
    print(f"Request failed with status code {response.status_code}")
    print("Response:", response.text)