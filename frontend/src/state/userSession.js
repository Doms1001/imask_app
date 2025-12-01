// frontend/src/state/userSession.js

let currentVisitorName = null;
let currentVisitorEmail = null;

export function setCurrentVisitorName(name) {
  currentVisitorName = name;
}

export function getCurrentVisitorName() {
  return currentVisitorName;
}

// 🆕 add these
export function setCurrentVisitorEmail(email) {
  currentVisitorEmail = email;
}

export function getCurrentVisitorEmail() {
  return currentVisitorEmail;
}
