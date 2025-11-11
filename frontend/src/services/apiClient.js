const BASE_URL = "http://localhost:4000"; // change to backend URL when deployed

export async function testBackend() {
  const res = await fetch(`${BASE_URL}/`);
  if (!res.ok) throw new Error("Backend unreachable");
  return res.text();
}

export async function getItems() {
  const res = await fetch(`${BASE_URL}/items`);
  if (!res.ok) throw new Error("Failed to fetch items");
  return res.json();
}
