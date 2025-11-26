// frontend/src/state/userSession.js

let currentVisitorName = "";

// save name from FillupScreen
export const setCurrentVisitorName = (name) => {
  currentVisitorName = name || "";
};

// read name in CCSF8
export const getCurrentVisitorName = () => currentVisitorName;
