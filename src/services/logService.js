import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

export const addLog = async (logData) => {
  try {
    await addDoc(collection(db, "logs"), {
      userId: logData.userId,
      activity: logData.activity,
      ip: logData.ip,
      timestamp: new Date().toISOString()
    });
    console.log("Log added ✅");
  } catch (error) {
    console.error("Error adding log ❌", error);
  }
};