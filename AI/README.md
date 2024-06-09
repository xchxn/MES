# Backend Guide
### Using Stack
<div align=center>
<img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white">
<img src="https://img.shields.io/badge/notion-000000?style=for-the-badge&logo=notion&logoColor=white">
<img src="https://img.shields.io/badge/visualstudiocode-007ACC?style=for-the-badge&logo=visualstudiocode&logoColor=white">
<img src="https://img.shields.io/badge/postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white">
<img src="https://img.shields.io/badge/Python-3776AB.svg?&style=for-the-badge&logo=Python&logoColor=white">
<img src="https://img.shields.io/badge/azure-61DAFB?style=for-the-badge&logo=azure&logoColor=white">
</div>

### Service Wiki


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

## 2. If you want start server in local
```bash
python3 build.py
uvicorn main:app --reload
```
- http://127.0.0.1:8000/predict로 POST요청을 보냄
- json 형식:
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