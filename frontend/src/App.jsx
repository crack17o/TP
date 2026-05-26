import { useCallback, useEffect, useState } from "react";
import { createTodo, deleteTodo, fetchTodos, updateTodo } from "./api";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const loadTodos = useCallback(async () => {
    setError(null);
    try {
      const data = await fetchTodos();
      setTodos(data);
    } catch (err) {
      setError(err.message || "Impossible de charger les tâches.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    setSubmitting(true);
    setError(null);
    try {
      const created = await createTodo(trimmed);
      setTodos((prev) => [created, ...prev]);
      setTitle("");
    } catch (err) {
      setError(err.message || "Impossible d'ajouter la tâche.");
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleTodo(todo) {
    setError(null);
    try {
      const updated = await updateTodo(todo.id, {
        title: todo.title,
        completed: !todo.completed,
      });
      setTodos((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    } catch (err) {
      setError(err.message || "Impossible de mettre à jour la tâche.");
    }
  }

  async function removeTodo(id) {
    setError(null);
    try {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err.message || "Impossible de supprimer la tâche.");
    }
  }

  const remaining = todos.filter((t) => !t.completed).length;

  return (
    <div className="app">
      <header className="header">
        <h1>Todo App</h1>
        <p className="subtitle">React · Django · SQLite · Docker</p>
      </header>

      <main className="card">
        <form className="todo-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nouvelle tâche…"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={submitting}
            aria-label="Titre de la tâche"
          />
          <button type="submit" disabled={submitting || !title.trim()}>
            Ajouter
          </button>
        </form>

        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}

        {loading ? (
          <p className="muted">Chargement…</p>
        ) : todos.length === 0 ? (
          <p className="muted">Aucune tâche pour le moment.</p>
        ) : (
          <ul className="todo-list">
            {todos.map((todo) => (
              <li key={todo.id} className={todo.completed ? "completed" : ""}>
                <label className="todo-item">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo)}
                  />
                  <span>{todo.title}</span>
                </label>
                <button
                  type="button"
                  className="delete-btn"
                  onClick={() => removeTodo(todo.id)}
                  aria-label={`Supprimer ${todo.title}`}
                >
                  Supprimer
                </button>
              </li>
            ))}
          </ul>
        )}

        <footer className="stats">
          {todos.length > 0 && (
            <span>
              {remaining} tâche{remaining !== 1 ? "s" : ""} restante
              {remaining !== 1 ? "s" : ""}
            </span>
          )}
        </footer>
      </main>
    </div>
  );
}
