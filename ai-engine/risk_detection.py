from fastapi import FastAPI, Body
from pydantic import BaseModel

app = FastAPI()

class ResourceConfig(BaseModel):
    configuration: str

@app.post("/analyze")
async def analyze_risk(config: ResourceConfig):
    configuration = config.configuration.lower()
    
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
