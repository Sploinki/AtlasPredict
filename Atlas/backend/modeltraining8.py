import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix
from imblearn.over_sampling import SMOTE
import joblib
import matplotlib.pyplot as plt
import seaborn as sns

# Load and preprocess the dataset
def load_and_prepare_data():
    dataset_path = 'NDMA_with_lagged_features.csv'  # Update this with the correct local path
    data = pd.read_csv(dataset_path)

    # Verify necessary columns exist
    required_columns = ['Average Discharge (Cusecs)', 'Pre-Flood Precipitation (mm)', 'During-Flood Precipitation (mm)', 'Average Temperature (°C)', 'Lagged_Average_Temperature', 'Lagged_During_Flood_Precipitation']
    missing_columns = [col for col in required_columns if col not in data.columns]
    if missing_columns:
        raise ValueError(f"Missing columns: {missing_columns}")

    def classify_discharge(discharge):
        if discharge <= 21948:
            return 0  # Low Risk
        elif 21948 < discharge <= 117000:
            return 1  # Medium Risk
        else:
            return 2  # High Risk

    # Apply classification
    data['Flood Risk'] = data['Average Discharge (Cusecs)'].apply(classify_discharge)

    # Define features and target
    X = data[['Pre-Flood Precipitation (mm)', 'During-Flood Precipitation (mm)', 'Average Temperature (°C)', 'Lagged_Average_Temperature', 'Lagged_During_Flood_Precipitation']]
    y = data['Flood Risk']

    # Balance the dataset using SMOTE
    smote = SMOTE(random_state=42)
    X_resampled, y_resampled = smote.fit_resample(X, y)

    return train_test_split(X_resampled, y_resampled, test_size=0.2, random_state=42)

# Train the model and perform grid search
def train_model(X_train, y_train):
    param_grid = {
        'n_estimators': [100, 200, 300],
        'max_depth': [10, 20, None],
        'min_samples_split': [2, 5, 10],
        'min_samples_leaf': [1, 2, 4]
    }

    grid_search = GridSearchCV(
        RandomForestClassifier(random_state=42),
        param_grid,
        cv=3,
        scoring='f1_macro',
        n_jobs=-1
    )
    grid_search.fit(X_train, y_train)
    print("Best Parameters:", grid_search.best_params_)

    best_model = RandomForestClassifier(**grid_search.best_params_, random_state=42)
    best_model.fit(X_train, y_train)
    return best_model

# Evaluate the model
def evaluate_model(model, X_test, y_test):
    y_pred = model.predict(X_test)
    print("Classification Report:")
    print(classification_report(y_test, y_pred, target_names=['Low Risk', 'Medium Risk', 'High Risk']))
    print("Accuracy:", accuracy_score(y_test, y_pred))

    # Confusion matrix
    conf_matrix = confusion_matrix(y_test, y_pred, labels=[0, 1, 2])
    plt.figure(figsize=(8, 6))
    sns.heatmap(conf_matrix, annot=True, fmt='d', cmap='Blues', xticklabels=['Low Risk', 'Medium Risk', 'High Risk'], yticklabels=['Low Risk', 'Medium Risk', 'High Risk'])
    plt.xlabel('Predicted')
    plt.ylabel('Actual')
    plt.title('Confusion Matrix')
    plt.show()

# Save the trained model
def save_model(model, file_path='flood_model.pkl'):
    joblib.dump(model, file_path)
    print(f"Model saved to {file_path}")

if __name__ == '__main__':
    # Load and split the data
    X_train, X_test, y_train, y_test = load_and_prepare_data()

    # Train the model
    model = train_model(X_train, y_train)

    # Evaluate the model
    evaluate_model(model, X_test, y_test)

    # Save the model
    save_model(model)
