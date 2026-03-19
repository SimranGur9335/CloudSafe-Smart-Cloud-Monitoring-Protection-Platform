import numpy as np
from sklearn.ensemble import IsolationForest
from fastapi import FastAPI, Body
from pydantic import BaseModel
from typing import List

app = FastAPI()

class LogEntry(BaseModel):
    login_attempts: int
    api_calls: int
    data_transfer_mb: int

# Initialize Isolation Forest
# In a real app, you'd train this on historical data
model = IsolationForest(contamination=0.1, random_state=42)

# Mock training data
X_train = np.random.normal(size=(100, 3))
model.fit(X_train)

@app.post("/detect-anomaly")
async def detect_anomaly(logs: List[LogEntry]):
    # Prepare data for prediction
    data = np.array([[l.login_attempts, l.api_calls, l.data_transfer_mb] for l in logs])
    
    # Predict (-1 for anomaly, 1 for normal)
    predictions = model.predict(data)
    scores = model.decision_function(data)
    
    results = []
    for i, pred in enumerate(predictions):
        results.append({
            "is_anomaly": bool(pred == -1),
            "anomaly_score": float(scores[i]),
            "severity": "High" if scores[i] < -0.1 else "Medium" if scores[i] < 0 else "Low"
        })
        
    return {"results": results}

@app.post("/analyze")
async def analyze_risk(config: dict = Body(...)):
    configuration = config.get("configuration", "").lower()
    
    risk_score = 0
    severity = "Low"
    recommended_fix = "No major issues detected."

    if "public" in configuration:
        risk_score = 95
        severity = "Critical"
        recommended_fix = "Disable public access and enforce private bucket policies."
    elif "open ports" in configuration:
        risk_score = 85
        severity = "High"
        recommended_fix = "Restrict port access to specific IP ranges using security groups."
    elif "weak policy" in configuration:
        risk_score = 75
        severity = "High"
        recommended_fix = "Audit IAM policies and remove wildcard permissions."
    elif "unencrypted" in configuration:
        risk_score = 60
        severity = "Medium"
        recommended_fix = "Enable server-side encryption using provider-managed keys."

    return {
        "risk_score": risk_score,
        "severity": severity,
        "recommended_fix": recommended_fix
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
