import { useState, useEffect } from "react";
import "./App.css";

// --- TodoItem component (Functional Component) ---
function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li className={`todo-item ${todo.completed ? "completed" : ""}`}>
      {/* Conditional rendering: show checkmark or empty circle */}
      <span className="status-icon">{todo.completed ? "✅" : "⭕"}</span>

      <span className="todo-text">{todo.text}</span>

      <div className="todo-actions">
        <button onClick={() => onToggle(todo.id)} className="btn-toggle">
          {todo.completed ? "Undo" : "Done"}
        </button>
        <button onClick={() => onDelete(todo.id)} className="btn-delete">
          Delete
        </button>
      </div>
    </li>
  );
}

// --- Main App component (Functional Component) ---
function App() {
  // State: list of todos (loaded from localStorage)
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem("todos");
    return saved ? JSON.parse(saved) : [];
  });

  // State: current input value (Form & User Input)
  const [inputValue, setInputValue] = useState("");

  // State: active filter tab
  const [filter, setFilter] = useState("all"); // "all" | "active" | "completed"

  // useEffect: save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // Add a new todo
  function handleAddTodo(e) {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    const newTodo = {
      id: Date.now(),
      text: trimmed,
      completed: false,
    };

    setTodos([...todos, newTodo]);
    setInputValue(""); // clear input after adding
  }

  // Toggle completed status
  function handleToggle(id) {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  // Delete a todo
  function handleDelete(id) {
    setTodos(todos.filter((todo) => todo.id !== id));
  }

  // Clear all completed todos
  function handleClearCompleted() {
    setTodos(todos.filter((todo) => !todo.completed));
  }

  // Filtered list (Conditional Rendering based on filter)
  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true; // "all"
  });

  const activeCount = todos.filter((t) => !t.completed).length;

  return (
    <div className="app">
      <h1 className="app-title">📝 My Todo App</h1>

      {/* Form & User Input */}
      <form onSubmit={handleAddTodo} className="todo-form">
        <input
          type="text"
          className="todo-input"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit" className="btn-add">
          Add
        </button>
      </form>

      {/* Filter Tabs */}
      <div className="filters">
        {["all", "active", "completed"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`btn-filter ${filter === f ? "active" : ""}`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Conditional Rendering: empty state message */}
      {todos.length === 0 ? (
        <p className="empty-msg">No todos yet. Add one above! 🎉</p>
      ) : filteredTodos.length === 0 ? (
        <p className="empty-msg">No {filter} todos.</p>
      ) : (
        // List rendering
        <ul className="todo-list">
          {filteredTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          ))}
        </ul>
      )}

      {/* Footer info */}
      {todos.length > 0 && (
        <div className="footer">
          <span>{activeCount} item{activeCount !== 1 ? "s" : ""} left</span>
          {todos.some((t) => t.completed) && (
            <button onClick={handleClearCompleted} className="btn-clear">
              Clear Completed
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
