# 🚀 CloudSafe – Smart Cloud Monitoring & Protection Platform

---

## 📌 Overview

**CloudSafe** is a smart cloud security platform designed to monitor, analyze, and protect cloud environments in real-time.

It provides:

* 🔐 Secure authentication (JWT-based)
* 📊 Real-time monitoring & logs
* ⚠️ Threat detection using anomaly detection
* 🌐 Zero Trust security simulation
* 🔄 Live updates using WebSockets (Socket.io)

---

## ⚙️ Tech Stack

* **Frontend:** React + Vite + TailwindCSS
* **Backend:** Node.js + Express
* **Database:** SQLite
* **Real-time:** Socket.io
* **Authentication:** JWT + bcrypt
* **AI/ML:** Custom anomaly detection logic

---

## 🧠 Features

* ✅ User Registration & Login
* ✅ Cloud resource monitoring
* ✅ Alert system for suspicious activities
* ✅ Real-time logs & updates
* ✅ Zero Trust access verification
* ✅ Manual security scan simulation
* ✅ AI-based anomaly detection

---

## 🖥️ Run Locally

### 📌 Prerequisites

* Node.js (v18+ recommended)

---

### 🔧 Installation

```bash
npm install
```

---

### 🔑 Environment Setup

Create a `.env` file in root directory:

```env
GEMINI_API_KEY=your_api_key_here
```

---

### 🚀 Run Backend

```bash
npm run dev
```

👉 Backend will run on:

```
http://localhost:3000
```

---

### 🎨 Run Frontend (separate terminal)

```bash
npx vite
```

👉 Frontend will run on:

```
http://localhost:5173
```

---

## 🔗 API Endpoints

| Endpoint              | Method | Description             |
| --------------------- | ------ | ----------------------- |
| `/api/auth/register`  | POST   | Register user           |
| `/api/auth/login`     | POST   | Login user              |
| `/api/resources`      | GET    | Get resources           |
| `/api/alerts`         | GET    | Get alerts              |
| `/api/logs`           | GET    | Get logs                |
| `/api/scan`           | POST   | Run security scan       |
| `/api/detect-anomaly` | POST   | Detect anomalies        |
| `/api/verify-trust`   | POST   | Zero trust verification |

---

## 📡 Real-Time Features

* Live log streaming
* Real-time alerts
* Socket-based updates

---

## 🛡️ Security Concepts Used

* Zero Trust Model
* Secure authentication
* Threat detection
* Log monitoring
* Access verification

---

## 📸 Demo

👉 Run the project locally and open:

* Frontend: http://localhost:5173
* Backend: http://localhost:3000

---

## 👨‍💻 Author

**Gursimran Singh Saini**
🔗 LinkedIn: https://www.linkedin.com/in/gursimran-singh-saini-786b0028b

---

## ⭐ Contribution

Feel free to fork this project and contribute!

---

## 📄 License

This project is for educational and demonstration purposes.

---

## 🚀 Future Improvements

* Cloud API integrations (AWS, Azure, GCP)
* Advanced AI-based threat detection
* Dashboard analytics
* Multi-user role system

---

🔥 *CloudSafe – Securing the Cloud, Smartly.*
