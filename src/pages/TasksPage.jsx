import { useEffect, useState, useMemo } from 'react';
import { getTasks, createTask, deleteTask, updateTask } from '../api/tasks';
import { getCategories } from '../api/categories';
import { getColorForCategory } from '../api/categoryColor';
import { useTheme } from '../hooks/Usetheme';
import '../styles/taskPage.css';

function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('');
}


function TasksPage({ user, onLogout, goToCategories }) {
  const { theme, toggleTheme } = useTheme();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newStatus, setNewStatus] = useState('pendiente');
  const [newPriority, setNewPriority] = useState('media');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [categories, setCategories] = useState([]);
  const [filterCategoryId, setFilterCategoryId] = useState('all');

  async function loadTasks() {
    try {
      setLoading(true);
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      console.error('Error al cargar tareas', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadCategories() {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error al cargar categorías', error);
    }
  }

  useEffect(() => {
    loadTasks();
    loadCategories();
  }, []);

  function resetForm() {
    setNewTitle('');
    setNewDescription('');
    setNewDueDate('');
    setNewStatus('pendiente');
    setNewPriority('media');
    setSelectedCategoryId('');
    setEditingTaskId(null);
  }

  async function handleSubmitTask(e) {
    e.preventDefault();

    const payload = {
      title: newTitle,
      description: newDescription,
      due_date: newDueDate || null,
      status: newStatus,
      priority: newPriority,
      category_id: selectedCategoryId ? Number(selectedCategoryId) : null,
    };

    try {
      if (editingTaskId) {
        await updateTask(editingTaskId, payload);
      } else {
        await createTask(payload);
      }
      resetForm();
      setShowForm(false);
      loadTasks();
    } catch (error) {
      console.error('Error al guardar tarea', error);
    }
  }

  function handleCreateClick() {
    resetForm();
    setShowForm(true);
  }

  function handleEditClick(task) {
    setEditingTaskId(task.id);
    setNewTitle(task.title || '');
    setNewDescription(task.description || '');
    setNewStatus(task.status || 'pendiente');
    setNewPriority(task.priority || 'media');
    setNewDueDate(task.due_date ? task.due_date.slice(0, 10) : '');
    setSelectedCategoryId(task.category_id || '');
    setShowForm(true);
  }

  async function handleDeleteTask(id) {
    const seguro = confirm('¿Eliminar esta tarea?');
    if (!seguro) return;

    try {
      await deleteTask(id);
      if (editingTaskId === id) {
        resetForm();
        setShowForm(false);
      }
      loadTasks();
    } catch (error) {
      console.error('Error al eliminar tarea', error);
    }
  }

  function getCategoryName(categoryId) {
    const cat = categories.find((c) => c.id === categoryId);
    return cat ? cat.name : null;
  }

  const filteredTasks = useMemo(() => {
    if (filterCategoryId === 'all') return tasks;
    return tasks.filter(
      (task) =>
        task.category_id !== null &&
        String(task.category_id) === String(filterCategoryId)
    );
  }, [tasks, filterCategoryId]);

  const prioridades = ['baja', 'media', 'alta'];

  return (
    <div className="tasks-outer">
      <div className="tasks-container">

        {/* ── Header ── */}
        <header className="tasks-header">
          <div className="tasks-header-left">
            <div className="tasks-avatar">
              {getInitials(user?.name)}
            </div>
            <div>
              <h1 className="tasks-title">Mis tareas</h1>
              {user && (
                <p className="tasks-user">
                  Hola, <span>{user.name}</span> — ¿qué hacemos hoy?
                </p>
              )}
            </div>
          </div>

          <div className="tasks-header-buttons">
            {/* Toggle dark / light */}
            <button className="btn-theme-toggle" onClick={toggleTheme} title="Cambiar tema">
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>

            <button className="btn-secondary" onClick={goToCategories}>
              Categorías
            </button>
            <button className="btn-primary" onClick={handleCreateClick}>
              + Nueva tarea
            </button>
            <button
              className="btn-outline"
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                onLogout();
              }}
            >
              Cerrar sesión
            </button>
          </div>
        </header>

        {/* ── Filtros ── */}
        <div className="tasks-filter-row">
          <button
            type="button"
            className={`tasks-filter-chip ${filterCategoryId === 'all' ? 'active' : ''}`}
            onClick={() => setFilterCategoryId('all')}
          >
            Todas
          </button>
          {categories.map((cat) => {
            const color = getColorForCategory(cat.id);
            return (
              <button
                key={cat.id}
                type="button"
                className={`tasks-filter-chip ${String(filterCategoryId) === String(cat.id) ? 'active' : ''}`}
                onClick={() => setFilterCategoryId(cat.id)}
                style={{
                  borderBottom: `2px solid ${color}`,
                  backgroundColor:
                    String(filterCategoryId) === String(cat.id)
                      ? `${color}18`
                      : undefined,
                  color:
                    String(filterCategoryId) === String(cat.id)
                      ? color
                      : undefined,
                }}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        <div className="tasks-main">

          {/* ── Formulario ── */}
          {showForm && (
            <section className="tasks-form-float">
              <div className="tasks-form-header">
                <div className="tasks-form-eyebrow">
                  {editingTaskId ? 'Editando' : 'Nueva tarea'}
                </div>
                <h2 className="tasks-section-title">
                  {editingTaskId ? '¿Qué cambiamos?' : '¿Qué tenés que hacer?'}
                </h2>
                <button
                  type="button"
                  className="tasks-close-btn"
                  onClick={() => { resetForm(); setShowForm(false); }}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmitTask} className="tasks-form">
                <label className="tasks-label">
                  Título
                  <input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                    className="tasks-input"
                    placeholder="Nombre de la tarea..."
                  />
                </label>

                <label className="tasks-label">
                  Descripción
                  <textarea
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="tasks-input tasks-textarea"
                    placeholder="Detalles opcionales..."
                  />
                </label>

                <label className="tasks-label">
                  Prioridad
                  <div className="tasks-priority-row">
                    {prioridades.map((p) => (
                      <button
                        key={p}
                        type="button"
                        className={`tasks-prio-btn ${newPriority === p ? `active-${p}` : ''}`}
                        onClick={() => setNewPriority(p)}
                      >
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                      </button>
                    ))}
                  </div>
                </label>

                <div className="tasks-form-row">
                  <label className="tasks-label">
                    Categoría
                    <select
                      value={selectedCategoryId}
                      onChange={(e) => setSelectedCategoryId(e.target.value)}
                      className="tasks-input"
                    >
                      <option value="">Sin categoría</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="tasks-label">
                    Fecha límite
                    <input
                      type="date"
                      value={newDueDate}
                      onChange={(e) => setNewDueDate(e.target.value)}
                      className="tasks-input"
                    />
                  </label>
                </div>

                <div className="tasks-form-divider" />

                <div className="tasks-form-actions">
                  <button type="submit" className="btn-primary">
                    {editingTaskId ? 'Guardar cambios →' : 'Crear tarea →'}
                  </button>
                  {editingTaskId && (
                    <button
                      type="button"
                      className="btn-ghost"
                      onClick={() => { resetForm(); setShowForm(false); }}
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </section>
          )}

          {/* ── Lista ── */}
          <section className="tasks-list-section">
            {!loading && (
              <div className="tasks-list-eyebrow">
                {filteredTasks.length}{' '}
                {filteredTasks.length === 1 ? 'tarea' : 'tareas'}
                {filterCategoryId !== 'all' ? ' en esta categoría' : ' en total'}
              </div>
            )}

            {loading ? (
              <p style={{ color: 'var(--text-faint)', fontSize: '13px' }}>Cargando tareas...</p>
            ) : tasks.length === 0 ? (
              <p style={{ color: 'var(--text-faint)', fontSize: '13px' }}>No hay tareas todavía.</p>
            ) : (
              <ul className="tasks-list">
                {filteredTasks.map((task) => {
                  const catName = getCategoryName(task.category_id);
                  const color = task.category_id
                    ? getColorForCategory(task.category_id)
                    : '#2a2a3a';

                  return (
                    <li
                      key={task.id}
                      className="tasks-item"
                      style={{ borderLeftColor: color }}
                    >
                      <div className="tasks-item-main">
                        <strong className="tasks-item-title">{task.title}</strong>

                        {task.description && (
                          <p className="tasks-item-description">
                            {task.description}
                          </p>
                        )}

                        <div className="tasks-chips-row">
                          <span
                            className="tasks-chip"
                            style={
                              task.priority === 'alta'
                                ? { background: '#2a0d0d', color: '#ff6b6b' }
                                : task.priority === 'media'
                                  ? { background: '#1e1810', color: '#ffac35' }
                                  : { background: '#0d2018', color: '#3cffac' }
                            }
                          >
                            {task.priority}
                          </span>
                          <span className="tasks-chip">{task.status}</span>
                          {catName && (
                            <span
                              className="tasks-chip tasks-chip-category"
                              style={{
                                backgroundColor: `${color}22`,
                                color: color,
                              }}
                            >
                              {catName}
                            </span>
                          )}
                        </div>

                        {task.due_date && (
                          <p className="tasks-due-date">
                            Vence: {new Date(task.due_date).toLocaleDateString()}
                          </p>
                        )}
                      </div>

                      <div className="tasks-item-actions">
                        <button
                          className="btn-small"
                          onClick={() => handleEditClick(task)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default TasksPage;