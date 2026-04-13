import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error
import joblib

path = r"C:\Users\Deval Srivastava\Desktop\ML Project\ML_Model\housing.csv"

# Load Data
df = pd.read_csv(path)

# Check Missing Values
print(df.isnull().sum())

# Handle Missing Values 
df['total_bedrooms'] = df['total_bedrooms'].fillna(df['total_bedrooms'].median())

# Convert categorical values to numerical values
df = pd.get_dummies(df, columns=['ocean_proximity'])

# Feature Engineering
df['rooms_per_household'] = df['total_rooms'] / df['households']
df['bedrooms_per_room'] = df['total_bedrooms'] / df['total_rooms']
df['population_per_household'] = df['population'] / df['households']

# Split Data 
x = df.drop('median_house_value', axis=1)
y = df['median_house_value']
x_train, x_test, y_train, y_test = train_test_split(x,y, test_size=0.2)


# Train ML Model
# Linear Regression
model = RandomForestRegressor()
model.fit(x_train, y_train)

# Evaluate
preds = model.predict(x_test)
print(mean_squared_error(y_test, preds))

# Save Model
joblib.dump(model, "house_model.pkl")









