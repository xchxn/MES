import os
import pandas as pd
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
from tensorflow.keras.losses import MeanSquaredError
from datetime import datetime
import joblib

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

# Prepare the data
X = data[['날짜', '관리구분', '품목', '품종', '등급']]
y_current_stock = data['현재고']
y_current_weight = data['현재중량']

# Convert date to ordinal for model training
X['날짜'] = X['날짜'].map(datetime.toordinal)

# One-hot encode categorical variables
X_encoded = pd.get_dummies(X, columns=['관리구분', '품목', '품종', '등급'])

# Save column names for later use in prediction
column_names = X_encoded.columns.tolist()
joblib.dump(column_names, 'column_names.pkl')

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

# Build and train the LSTM model
def build_lstm_model(input_shape):
    model = Sequential([
        LSTM(50, activation='relu', input_shape=input_shape),
        Dense(1)
    ])
    model.compile(optimizer='adam', loss=MeanSquaredError(), metrics=['mae'])
    return model

model_stock = build_lstm_model((X_scaled.shape[1], X_scaled.shape[2]))
model_stock.fit(X_scaled, y_current_stock_scaled, epochs=10, batch_size=32, validation_split=0.2, verbose=1)
model_stock.save('model_stock.h5')

model_weight = build_lstm_model((X_scaled.shape[1], X_scaled.shape[2]))
model_weight.fit(X_scaled, y_current_weight_scaled, epochs=10, batch_size=32, validation_split=0.2, verbose=1)
model_weight.save('model_weight.h5')

# Save the scalers
joblib.dump(scaler, 'scaler.pkl')
joblib.dump(stock_scaler, 'stock_scaler.pkl')
joblib.dump(weight_scaler, 'weight_scaler.pkl')
