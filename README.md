# Atlas: Flood Risk Prediction and Alerts System

Atlas is a web-based application that provides real-time flood risk predictions and alerts using AI models and weather data. The system allows users to visualize flood risks on an interactive map and receive alerts for regions under medium or high risk.

## Features
- **Interactive Map**: Displays flood risk levels for different provinces.
- **Real-Time Predictions**: Uses trained AI models to predict flood risks based on weather data.
- **Random Risk Mode**: Simulates flood risk levels for testing and visualization.
- **Alerts System**: Notifies users of medium and high-risk regions.

## Technologies Used
- **Frontend**: React, Material-UI, Framer Motion, Axios
- **Backend**: Flask, MongoDB, Joblib (for AI models)
- **Map Integration**: Leaflet.js
- **Styling**: CSS

## Installation and Setup
### Prerequisites
- Node.js and npm installed
- Python 3.x installed
- MongoDB installed and running locally

### Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd frontend
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
3. Start the Flask server:
   ```bash
   python app.py

### Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
2. Install dependencies:
   ```bash
   npm install
3. Start the development server:
   ```bash
   npm start

## MongoDB Setup
- Ensure MongoDB is running locally.
- The backend will automatically connect to the atlaspredict database.

## Usage
1. Open the frontend in your browser at http://localhost:3000.
2. Use the map to view flood risk levels for different provinces.
3. Enable Random Risk Mode to simulate flood risks.
4. Navigate to the Alerts page to view notifications for medium and high-risk regions.
