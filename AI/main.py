import os
import pandas as pd
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from tensorflow.keras.models import load_model
from tensorflow.keras.losses import MeanSquaredError
from datetime import datetime, timedelta
import numpy as np
import joblib

# Load models and scalers
model_stock = load_model('model_stock.h5', custom_objects={'MeanSquaredError': MeanSquaredError})
model_weight = load_model('model_weight.h5', custom_objects={'MeanSquaredError': MeanSquaredError})
scaler = joblib.load('scaler.pkl')
stock_scaler = joblib.load('stock_scaler.pkl')
weight_scaler = joblib.load('weight_scaler.pkl')
column_names = joblib.load('column_names.pkl')

# # Step 1: Read the Excel files
# extract_dir = 'excel'

# # Read the Excel files into a DataFrame
# data_frames = []
# for file_name in os.listdir(extract_dir):
#     if file_name.endswith('.xlsx'):
#         file_path = os.path.join(extract_dir, file_name)
#         date_str = file_name[:-5]  # Extract date from file name (assuming format YY.MM.DD.xlsx)
#         date = datetime.strptime(date_str, '%y.%m.%d')
#         df = pd.read_excel(file_path)
#         df['날짜'] = date  # Add the date column to the dataframe
#         data_frames.append(df)

# # Concatenate all data frames
# data = pd.concat(data_frames, ignore_index=True)

# # Select the required columns
# columns = ['날짜', '관리구분', '품목', '품종', '등급', '현재고', '현재중량']
# data = data[columns]

# Step 2: Create the FastAPI application
app = FastAPI()

class PredictionRequest(BaseModel):
    관리구분: str
    품목: str
    품종: str
    등급: str
    기준수량: int
    기준중량: int
    관리자: bool

def prepare_input_data(request: PredictionRequest, prediction_date: datetime):
    input_data = {
        '날짜': prediction_date.toordinal(),
        '관리구분': request.관리구분,
        '품목': request.품목,
        '품종': request.품종,
        '등급': request.등급
    }

    input_df = pd.DataFrame([input_data])
    input_encoded = pd.get_dummies(input_df).reindex(columns=column_names, fill_value=0)
    input_scaled = scaler.transform(input_encoded)
    input_scaled = input_scaled.reshape((input_scaled.shape[0], 1, input_scaled.shape[1]))
    return input_scaled

@app.post("/predict")
def predict(request: PredictionRequest):
    # Determine the number of days for prediction
    prediction_days = 7 if request.관리자 else 2
    results = []

    for i in range(prediction_days):
        prediction_date = datetime.now() + timedelta(days=i)

        # Prepare the input data for prediction
        input_scaled = prepare_input_data(request, prediction_date)

        # Predict current stock and weight
        pred_stock_scaled = model_stock.predict(input_scaled)[0][0]
        pred_weight_scaled = model_weight.predict(input_scaled)[0][0]

        # Inverse transform the predictions to original scale
        pred_stock = stock_scaler.inverse_transform([[pred_stock_scaled]])[0][0]
        pred_weight = weight_scaler.inverse_transform([[pred_weight_scaled]])[0][0]

        # Determine the 'O' or 'X' based on 기준수량 and 기준중량
        stock_status = 'O' if pred_stock > request.기준수량 else 'X'
        weight_status = 'O' if pred_weight > request.기준중량 else 'X'

        # Add the result to the list
        results.append({
            "예측날짜": prediction_date.strftime('%Y-%m-%d'),
            "예측고": pred_stock,
            "예측중량": pred_weight,
            "재고상태": stock_status,
            "중량상태": weight_status
        })

    # Return the results
    return results

# Run the app with uvicorn (not in the script itself, use command line)
# uvicorn main:app --reload
