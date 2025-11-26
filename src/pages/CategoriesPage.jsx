import { useEffect, useState } from 'react';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../api/categories';
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
        // crear categoría nueva
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
      if (editingId === id) {
        resetForm();
      }
      loadCategories();
    } catch (err) {
      console.error('Error al eliminar categoría', err);
      setError('No se pudo eliminar la categoría.');
    }
  }

  return (
    <div className="cats-outer">
      <div className="cats-container">
        <header className="cats-header">
          <div>
            <h1 className="cats-title">Categorías</h1>
            <p className="cats-subtitle">
              Organizá tus tareas en grupos como Estudio, Trabajo, Personal...
            </p>
          </div>

          <button className="btn-outline" onClick={goBack}>
            Volver a tareas
          </button>
        </header>

        {/* Formulario */}
        <section className="cats-form-section">
          <h2 className="cats-section-title">
            {editingId ? 'Editar categoría' : 'Nueva categoría'}
          </h2>

          <form onSubmit={handleSubmit} className="cats-form">
            <label className="cats-label">
              Nombre de la categoría
              <input
                className="cats-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>

            {error && <p className="cats-error">{error}</p>}
            {success && <p className="cats-success">{success}</p>}

            <div className="cats-actions">
              <button type="submit" className="btn-primary">
                {editingId ? 'Guardar cambios' : 'Crear categoría'}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={resetForm}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </section>

    
        <section>
          {loading ? (
            <p>Cargando categorías...</p>
          ) : categories.length === 0 ? (
            <p>No tenés categorías todavía.</p>
          ) : (
            <ul className="cats-list">
              {categories.map((cat) => (
                <li key={cat.id} className="cats-item">
                  <span>{cat.name}</span>

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
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

export default CategoriesPage;



