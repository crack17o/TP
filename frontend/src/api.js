const API_BASE = import.meta.env.VITE_API_URL || "/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    let message = `Erreur HTTP ${response.status}`;
    try {
      const body = await response.json();
      if (body.detail) message = body.detail;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }

  if (response.status === 204) return null;
  return response.json();
}

export function fetchTodos() {
  return request("/todos/");
}

export function createTodo(title) {
  return request("/todos/", {
    method: "POST",
    body: JSON.stringify({ title, completed: false }),
  });
}

export function updateTodo(id, data) {
  return request(`/todos/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteTodo(id) {
  return request(`/todos/${id}/`, { method: "DELETE" });
}
