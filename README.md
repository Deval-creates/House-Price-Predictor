# 🏠 House Price Prediction Web App

A full-stack machine learning web application that predicts house prices based on user inputs like location, number of rooms, population, and proximity to the ocean.

---

## 🚀 Features

* 🔮 Predict house prices using a trained ML model
* 📍 Location-based prediction (latitude & longitude support)
* 🧠 Machine Learning model built with Scikit-learn
* ⚡ FastAPI backend for high performance APIs
* 🎯 Clean and interactive frontend UI
* 🔐 User authentication (Login & Signup)
* ❤️ Add houses to favourites 

---

## 🛠️ Tech Stack

### Backend:

* FastAPI
* Python
* Scikit-learn
* NumPy
* SQLAlchemy
* SQLite

### Frontend:

* HTML
* CSS
* JavaScript

### Other Tools:

* Joblib (for model loading)
* Uvicorn (server)

---

## 📊 Machine Learning Model

* Model Used: Random Forest Regressor
* Dataset: California Housing Dataset
* Features:

  * Longitude
  * Latitude
  * Total Rooms
  * Total Bedrooms
  * Population
  * Ocean Proximity

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```
git clone https://github.com/your-username/House-Price-Predictor.git
cd House-Price-Predictor
```

---

### 2. Create virtual environment

```
python -m venv venv
```

Activate it:

**Windows:**

```
venv\Scripts\activate
```

**Mac/Linux:**

```
source venv/bin/activate
```

---

### 3. Install dependencies

```
pip install -r requirements.txt
```

---

### 4. Run the backend

```
uvicorn main:app --reload
```

---

### 5. Run frontend
Open Frontend/BuyHouse/vite-project in terminal
then run the command npm run dev
After frontend server is running 
Only then open index.html inside Frontend folder.

---

## ⚠️ Important Note

The trained ML model (`house_model.pkl`) is not included in this repository due to GitHub file size limits.

👉 You can:

* Train the model again
* Or download it from external storage (if provided)

---

## 🔐 Authentication

* User Signup
* User Login
* Password hashing using bcrypt
* JWT-based authentication

---

## 📌 Future Improvements

* 🏡 House listing with filters
* ❤️ Favourites system
* 📊 Model improvement & accuracy tuning
* 🌐 Deployment 

---

## 👨‍💻 Author

**Deval Srivastava**
---

## 📜 License

This project is for educational purposes.
