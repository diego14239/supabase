import { useState } from 'react';
import type { FormEvent } from 'react';
import { useTareas } from './hooks/useTareas';
import { useSubirAdjunto } from './hooks/useSubirAdjunto';
import { useEstadisticasTareas } from './hooks/useEstadisticasTareas';
import './App.css';

function App() {
  const {
    tareas,
    loading,
    error,
    crear,
    actualizar,
    eliminar,
    isCreating,
  } = useTareas();
  const { subir, uploading } = useSubirAdjunto();
  const { estadisticas } = useEstadisticasTareas();

  const [titulo, setTitulo] = useState('');

  const handleCrear = (e: FormEvent) => {
    e.preventDefault();
    if (!titulo.trim()) return;
    crear({ titulo: titulo.trim() });
    setTitulo('');
  };

  const handleToggle = (id: string, completada: boolean) => {
    actualizar({ id, data: { completada: !completada } });
  };

  const handleAdjuntar = async (id: string, file: File) => {
    const url = await subir(file);
    if (url) {
      actualizar({ id, data: { adjunto_url: url } });
    }
  };

  if (loading) return <p className="estado">Cargando tareas...</p>;
  if (error) return <p className="estado error">Error: {error}</p>;

  return (
    <div className="app">
      <h1>Tareas (práctica CRUD + Supabase)</h1>

      {estadisticas && (
        <p className="estadisticas">
          Total: {estadisticas.total} · Completadas: {estadisticas.completadas} · Pendientes: {estadisticas.pendientes}
        </p>
      )}

      <form onSubmit={handleCrear} className="form-crear">
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Nueva tarea..."
        />
        <button type="submit" disabled={isCreating}>
          {isCreating ? 'Creando...' : 'Agregar'}
        </button>
      </form>

      <ul className="lista-tareas">
        {tareas.map((tarea) => (
          <li key={tarea.id} className={tarea.completada ? 'completada' : ''}>
            <input
              type="checkbox"
              checked={tarea.completada}
              onChange={() => handleToggle(tarea.id, tarea.completada)}
            />
            <span>{tarea.titulo}</span>

            {tarea.adjunto_url && (
              <a href={tarea.adjunto_url} target="_blank" rel="noreferrer">
                📎 ver adjunto
              </a>
            )}

            <input
              type="file"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleAdjuntar(tarea.id, file);
              }}
            />

            <button onClick={() => eliminar(tarea.id)}>Eliminar</button>
          </li>
        ))}
      </ul>

      {tareas.length === 0 && <p className="estado">No hay tareas todavía.</p>}
    </div>
  );
}

export default App;
