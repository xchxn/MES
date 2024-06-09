# AI Guide
### Using Stack
<div align=center>
<img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white">
<img src="https://img.shields.io/badge/notion-000000?style=for-the-badge&logo=notion&logoColor=white">
<img src="https://img.shields.io/badge/visualstudiocode-007ACC?style=for-the-badge&logo=visualstudiocode&logoColor=white">
<img src="https://img.shields.io/badge/postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white">
<img src="https://img.shields.io/badge/Python-3776AB.svg?&style=for-the-badge&logo=Python&logoColor=white">
<img src="https://img.shields.io/badge/azure-61DAFB?style=for-the-badge&logo=azure&logoColor=white">
<img src="https://img.shields.io/badge/Tensorflow-FF8C00?style=for-the-badge&logo=Tensorflow&logoColor=white">
<img src="https://img.shields.io/badge/scikit-learn-FF8C00?style=for-the-badge&logo=scikit-learn&logoColor=white">
<img src="https://img.shields.io/badge/pandas-3776AB?style=for-the-badge&logo=pandas&logoColor=white">
<img src="https://img.shields.io/badge/FastAPI-9ACD32?style=for-the-badge&logo=FastAPI&logoColor=white">
</div>

### Service Wiki - Overview
- build.py
  - Call KKMC DB data as pandas DataFrame object about 1-year data
  - Prune unnecessary columns (ex. 창고재고현황)
  - Sort data by '날짜', '관리구분', '품목', '품종', '등급' in ascending order
  - Normalize data with MinMaxScaler() function
  - Build LSTM model and scaler, which is great for predicting sequential data

- main.py
  - Load LSTM model and scaler made by build.py
  - Deacare FastAPI here as 'app'
  - return 'predict' jsons in given requests.

- Requesting json
  ```json
    {
    "관리구분": "고구마",
    "품목": "일반고구마",
    "품종": "하루까",
    "등급": "상",
    "기준수량": 100,
    "기준중량": 200,
    "관리자": true
    }
  ```

- Responsing json
  ```json
    {
    "예측날짜": "2024-06-03",
    "예측고": 443.58633,
    "예측중량": 24083.25938,
    "재고상태": "O",
    "중량상태": "X"
    }
  ```

# To Start
## 0. Need Environment
- Python v3.9
- Click to Install Python 3.9 -> <a src=https://www.python.org/downloads/release/python-3918><img src="https://img.shields.io/badge/Python-3776AB.svg?&style=for-the-badge&logo=Python&logoColor=white"></a>
- or via commands:
  ```
  sudo yum install python39-pip (on centOS based)
  sudo apt install python3.9 (on Ubuntu)
  brew install python3.9 (on macOS)
  ```

## 1. Set Environment
- Execute as venv.
  ```bash
  1.   git clone https://github.com/jchanho99/AI_NES
  2.   cd AI
  3.   python3 -m venv .venv
  4-1. source .venv/bin/activate (on macOS, linux)
  4-2. .\venv\Scripts\activate (on windows powershell)
  5.   pip install -r requirements.txt
  
  6.   deactivate (if you are done)
  ```

## 2-1. If you want start server in local
```bash
python3 build.py
uvicorn main:app --reload
```
- Send POST Request to http://127.0.0.1:8000/predict

## 2-2. If you want start server in Azure
1. Sign up Azure
2. Select 'Virtual machines' and make one, following instructions
3. Connect to VM
4. Type this command:
  ```
  sudo apt install nginx
  sudo nano /etc/nginx/sites-available/default
  ```
  ```
  server {
    listen 80;
    server_name your_domain_or_ip;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
  }
  ```
  ```
  sudo nginx -t
  sudo systemctl restart nginx
  ```
4. Execute "Set Environment" 1 to 5.
5. Follow this commands
  ```bash
  python3 build.py
  sudo gunicorn -w 2 -k uvicorn.workers.UvicornWorker main:app --bind 0.0.0.0:8000
  ```
6. Send POST Request to http://(public IP address set in VM)/predict