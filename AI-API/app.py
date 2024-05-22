import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, LSTM
from sklearn.preprocessing import MinMaxScaler
from datetime import datetime, timedelta
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

# Load the dataset
file_path = 'train.csv'
data = pd.read_csv(file_path)

# Convert '날짜' to datetime
data['날짜'] = pd.to_datetime(data['날짜'], format='%y.%m.%d')

# Define the key columns and the features
key_columns = ['관리구분', '품목', '품종', '등급']
features = ['현재고', '현재중량']

# Handle missing data by forward filling
data[features] = data[features].fillna(method='ffill')

# Define the FastAPI app
app = FastAPI()

# Pydantic model for input
class PredictionRequest(BaseModel):
    관리구분: str
    품목: str
    품종: str
    등급: str
    n: int

# Normalize the data function
def normalize_data(df):
    scaler = MinMaxScaler()
    df[features] = scaler.fit_transform(df[features])
    return df, scaler

# Create sequences for the LSTM model
def create_sequences(data, seq_length):
    xs, ys = [], []
    for i in range(len(data) - seq_length):
        x = data[i:i+seq_length]
        y = data[i+seq_length]
        xs.append(x)
        ys.append(y)
    return np.array(xs), np.array(ys)

# Function to train and predict for a given key and n days
def predict_for_key(key, n):
    # Filter the data for the specified key
    filtered_data = data[(data['관리구분'] == key['관리구분']) &
                         (data['품목'] == key['품목']) &
                         (data['품종'] == key['품종']) &
                         (data['등급'] == key['등급'])]
    
    seq_length = 10
    
    if len(filtered_data) <= seq_length:
        raise ValueError("Insufficient data points for the specified key.")
    
    # Sort by date
    filtered_data = filtered_data.sort_values('날짜').set_index('날짜')
    
    # Normalize the data
    filtered_data, scaler = normalize_data(filtered_data.copy())
    
    # Create sequences
    X, y = create_sequences(filtered_data[features].values, seq_length)
    
    if len(X) == 0 or len(y) == 0:
        raise ValueError("Empty sequences after creation.")
    
    # Split the data into training and testing sets
    split = int(0.8 * len(X))
    X_train, X_test = X[:split], X[split:]
    y_train, y_test = y[:split], y[split:]
    
    if len(X_train) == 0 or len(X_test) == 0 or len(y_train) == 0 or len(y_test) == 0:
        raise ValueError("Insufficient train/test split data.")
    
    # Build the LSTM model
    model = Sequential()
    model.add(LSTM(50, return_sequences=True, input_shape=(seq_length, len(features))))
    model.add(LSTM(50, return_sequences=False))
    model.add(Dense(25))
    model.add(Dense(len(features)))
    
    model.compile(optimizer='adam', loss='mean_squared_error')
    
    # Train the model
    model.fit(X_train, y_train, batch_size=1, epochs=10)
    
    # Use the most recent sequence for prediction
    recent_sequence = filtered_data[features].values[-seq_length:]
    recent_sequence = recent_sequence[np.newaxis, :, :]  # Reshape for prediction
    
    # Make predictions for the next n days
    predictions = []
    
    for _ in range(n):
        pred = model.predict(recent_sequence)[0]
        predictions.append(pred)
        # Update the sequence with the new prediction
        recent_sequence = np.append(recent_sequence[:, 1:, :], [[pred]], axis=1)
    
    predictions = scaler.inverse_transform(predictions)
    
    # Create a DataFrame with predictions
    today = datetime.today()
    prediction_dates = [today + timedelta(days=i) for i in range(1, n+1)]
    prediction_df = pd.DataFrame(predictions, index=prediction_dates, columns=[f'Predicted_{col}' for col in features])
    
    return prediction_df

# Define the prediction endpoint
@app.post("/predict")
def predict(request: PredictionRequest):
    key = {
        '관리구분': request.관리구분,
        '품목': request.품목,
        '품종': request.품종,
        '등급': request.등급
    }
    n_days = request.n
    
    try:
        prediction_df = predict_for_key(key, n_days)
        prediction_df.index = prediction_df.index.date  # Remove the time part from the dates
        return prediction_df.to_dict()
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

# To run the server, use the command: uvicorn script_name:app --reload
