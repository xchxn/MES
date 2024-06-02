import os
import pandas as pd
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
from datetime import datetime, timedelta
import numpy as np

# Step 1: Read the Excel files
extract_dir = 'excel'

# Read the Excel files into a DataFrame
data_frames = []
for file_name in os.listdir(extract_dir):
    if file_name.endswith('.xlsx'):
        file_path = os.path.join(extract_dir, file_name)
        date_str = file_name[:-5]  # Extract date from file name (assuming format YY.MM.DD.xlsx)
        date = datetime.strptime(date_str, '%y.%m.%d')
        df = pd.read_excel(file_path)
        df['날짜'] = date  # Add the date column to the dataframe
        data_frames.append(df)

# Concatenate all data frames
data = pd.concat(data_frames, ignore_index=True)

# Select the required columns
columns = ['날짜', '관리구분', '품목', '품종', '등급', '현재고', '현재중량']
data = data[columns]

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

def filter_data(data, category, item, variety, grade):
    filtered_data = data[
        (data['관리구분'] == category) & 
        (data['품목'] == item) & 
        (data['품종'] == variety) & 
        (data['등급'] == grade)
    ]
    return filtered_data

def build_lstm_model(input_shape):
    model = Sequential([
        LSTM(35, activation='relu', input_shape=input_shape),
        Dense(1)
    ])
    model.compile(optimizer='adam', loss='mse', metrics=['mae'])
    return model

@app.post("/predict")
def predict(request: PredictionRequest):
    # Step 3: Filter data based on the input parameters
    filtered_data = filter_data(data, request.관리구분, request.품목, request.품종, request.등급)
    if filtered_data.empty:
        raise HTTPException(status_code=404, detail="No matching data found")

    # Prepare the data
    X = filtered_data[['날짜', '관리구분', '품목', '품종', '등급']]
    y_current_stock = filtered_data['현재고']
    y_current_weight = filtered_data['현재중량']

    # Convert date to ordinal for model training
    X['날짜'] = X['날짜'].map(datetime.toordinal)

    # One-hot encode categorical variables
    X_encoded = pd.get_dummies(X, columns=['관리구분', '품목', '품종', '등급'])

    # Scale the features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X_encoded)

    # Normalize the targets
    stock_scaler = MinMaxScaler()
    weight_scaler = MinMaxScaler()

    y_current_stock_scaled = stock_scaler.fit_transform(y_current_stock.values.reshape(-1, 1))
    y_current_weight_scaled = weight_scaler.fit_transform(y_current_weight.values.reshape(-1, 1))

    # Reshape data for LSTM [samples, timesteps, features]
    X_scaled = X_scaled.reshape((X_scaled.shape[0], 1, X_scaled.shape[1]))

    # Step 4: Train the TensorFlow LSTM model
    model_stock = build_lstm_model((X_scaled.shape[1], X_scaled.shape[2]))
    model_stock.fit(X_scaled, y_current_stock_scaled, epochs=10, batch_size=32, validation_split=0.2, verbose=1)

    model_weight = build_lstm_model((X_scaled.shape[1], X_scaled.shape[2]))
    model_weight.fit(X_scaled, y_current_weight_scaled, epochs=10, batch_size=32, validation_split=0.2, verbose=1)

    # Step 5: Prediction
    prediction_days = 7 if request.관리자 else 2
    results = []

    for i in range(1, prediction_days + 1):
        prediction_date = datetime.now() + timedelta(days=i)

        # Prepare the input data for prediction
        input_data = {
            '날짜': prediction_date.toordinal(),
            '관리구분': request.관리구분,
            '품목': request.품목,
            '품종': request.품종,
            '등급': request.등급
        }

        input_df = pd.DataFrame([input_data])
        input_encoded = pd.get_dummies(input_df).reindex(columns=X_encoded.columns, fill_value=0)
        input_scaled = scaler.transform(input_encoded)
        input_scaled = input_scaled.reshape((input_scaled.shape[0], 1, input_scaled.shape[1]))

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
            "현재고": pred_stock,
            "현재중량": pred_weight,
            "stock_status": stock_status,
            "weight_status": weight_status
        })

    # Return the results
    return results

# Run the app with uvicorn (not in the script itself, use command line)
# uvicorn main:app --reload

