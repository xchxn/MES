## pre-loading

- python version: 3.9
  - ``pip install -r requirements.txt``

## instructions

- API activation commands
  - ``uvicorn app:app --reload``
  
- 요청 방법
  1. url: http://127.0.0.1:8000/predict
  2. POST, JSON
  3. JSON 값 형태
    ''{
    "관리구분": "고구마",
    "품목": "일반고구마",
    "품종": "소담미",
    "등급": "종자용",
    "n": 1            # 예측하고 싶은 날수, 최대 14일, int 자료형
}''
