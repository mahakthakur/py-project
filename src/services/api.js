const API_BASE_URL = "http://127.0.0.1:8000";

export async function ingestPdf(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/api/ingest`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to process PDF file.");
  }

  return await response.json();
}

export async function sendChatMessage(question) {
  const response = await fetch(`${API_BASE_URL}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to fetch response from agent.");
  }

  return await response.json();
}
// Add this robust fetch wrapper inside your api service or dashboard handler
export async function ingestDocumentWithTimeout(file, timeoutMs = 1500) {
  const formData = new FormData();
  formData.append("file", file);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch("http://localhost:8000/api/ingest", {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (!response.ok) throw new Error("Backend error");
    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    console.warn("Backend bridge timed out or unavailable. Loading instant optimized fallback payload.");
    return null; // Triggers instant local rendering fallback
  }
}