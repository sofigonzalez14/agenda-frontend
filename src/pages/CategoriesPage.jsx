import { useEffect, useState } from 'react';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../api/categories';
import { getColorForCategory } from '../api/categoryColor';
import '../styles/CategoriesPage.css';

function CategoriesPage({ goBack }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState(null);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function loadCategories() {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Error al cargar categorías', err);
      setError('No se pudieron cargar las categorías.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  function resetForm() {
    setName('');
    setEditingId(null);
    setError('');
    setSuccess('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingId) {
        await updateCategory(editingId, name);
        setSuccess('Categoría actualizada correctamente.');
      } else {
        await createCategory(name);
        setSuccess('Categoría creada correctamente.');
      }
      resetForm();
      loadCategories();
    } catch (err) {
      console.error('Error al guardar categoría', err);
      const msg =
        err.response?.data?.message ||
        'No se pudo guardar la categoría. Probá de nuevo.';
      setError(msg);
    }
  }

  function handleEdit(cat) {
    setEditingId(cat.id);
    setName(cat.name);
    setError('');
    setSuccess('');
  }

  async function handleDelete(id) {
    const seguro = confirm('¿Eliminar esta categoría?');
    if (!seguro) return;
    setError('');
    setSuccess('');

    try {
      await deleteCategory(id);
      if (editingId === id) resetForm();
      loadCategories();
    } catch (err) {
      console.error('Error al eliminar categoría', err);
      setError('No se pudo eliminar la categoría.');
    }
  }

  return (
    <div className="cats-outer">
      <div className="cats-container">

        {/* ── Header ── */}
        <header className="cats-header">
          <div>
            <h1 className="cats-title">Categorías</h1>
            <p className="cats-subtitle">
              Organizá tus tareas en grupos como Estudio, Trabajo, Personal...
            </p>
          </div>
          <button className="btn-outline" onClick={goBack}>
            ← Volver a tareas
          </button>
        </header>

        {/* ── Formulario ── */}
        <section className="cats-form-section">
          <div className="cats-form-top">
            <div className="cats-form-eyebrow">
              {editingId ? 'Editando' : 'Nueva categoría'}
            </div>
            <h2 className="cats-section-title">
              {editingId ? '¿Qué nombre le ponemos?' : '¿Cómo se llama?'}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="cats-form">
            <label className="cats-label">
              Nombre de la categoría
              <input
                className="cats-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Trabajo, Personal, Estudio..."
                required
              />
            </label>

            {error && <p className="cats-error">{error}</p>}
            {success && <p className="cats-success">{success}</p>}

            <div className="cats-actions">
              <button type="submit" className="btn-primary">
                {editingId ? 'Guardar cambios →' : 'Crear categoría →'}
              </button>
              {editingId && (
                <button type="button" className="btn-ghost" onClick={resetForm}>
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </section>

        {/* ── Listado ── */}
        <section>
          {!loading && categories.length > 0 && (
            <div className="cats-list-eyebrow">
              {categories.length}{' '}
              {categories.length === 1 ? 'categoría' : 'categorías'}
            </div>
          )}

          {loading ? (
            <p style={{ color: '#3a3a50', fontSize: '13px' }}>
              Cargando categorías...
            </p>
          ) : categories.length === 0 ? (
            <p style={{ color: '#3a3a50', fontSize: '13px' }}>
              No tenés categorías todavía.
            </p>
          ) : (
            <ul className="cats-list">
              {categories.map((cat) => {
                const color = getColorForCategory(cat.id);
                return (
                  <li
                    key={cat.id}
                    className="cats-item"
                    style={{ borderLeft: `3px solid ${color}` }}
                  >
                    <div className="cats-item-left">
                      <span
                        className="cats-color-dot"
                        style={{ backgroundColor: color, color }}
                      />
                      <span>{cat.name}</span>
                    </div>

                    <div className="cats-item-buttons">
                      <button
                        className="btn-small"
                        type="button"
                        onClick={() => handleEdit(cat)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn-delete"
                        type="button"
                        onClick={() => handleDelete(cat.id)}
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
  );
}

export default CategoriesPage;