// src/App.tsx
import { useEffect, useState } from 'react';
import { pokemonService } from './services/pokemonService';
import type { PokemonDTO, FilterDTO, PokemonRAW } from './types/pokemon.types';
import './App.css'; // Importamos nuestros nuevos estilos

function App() {
  const [pokemones, setPokemones] = useState<PokemonDTO[]>([]);
  const [formData, setFormData] = useState<PokemonDTO>({ nombre: '', tipo: '', nivel: 1 });
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [filtros, setFiltros] = useState<FilterDTO[]>([]);
  const [statusSeleccionado, setStatusSeleccionado] = useState<PokemonRAW | null>(null);

  const cargarPokemones = async () => {
    try {
      const filtrosProcesados = filtros.filter(f => f.valor !== '').map(f => ({
        ...f,
        valor: f.campo === 'NIVEL' ? Number(f.valor) : f.valor
      }));

      const response = await pokemonService.obtenerLista({
        pagination: { cantidad: 100, pagina: 0 },
        filters: filtrosProcesados
      });
      setPokemones(response.data);
    } catch (error) {
      console.error("Error cargando la lista:", error);
    }
  };

  useEffect(() => { cargarPokemones(); }, []);

  // --- MÉTODOS DE FILTROS ---
  const agregarFiltro = () => setFiltros([...filtros, { campo: 'NOMBRE', operador: 'LIKE', valor: '' }]);
  
  const actualizarFiltro = (index: number, key: keyof FilterDTO, value: string) => {
    const nuevosFiltros = [...filtros];
    nuevosFiltros[index] = { ...nuevosFiltros[index], [key]: value };
    if (key === 'campo') {
        nuevosFiltros[index].operador = value === 'NIVEL' ? '>' : 'LIKE';
    }
    setFiltros(nuevosFiltros);
  };

  const eliminarFiltro = (index: number) => setFiltros(filtros.filter((_, i) => i !== index));
  const aplicarFiltros = (e: React.FormEvent) => { e.preventDefault(); cargarPokemones(); };
  
  const limpiarFiltros = () => {
    setFiltros([]);
    setTimeout(() => {
        pokemonService.obtenerLista({ pagination: { cantidad: 100, pagina: 0 }, filters: [] })
            .then(res => setPokemones(res.data));
    }, 50);
  };

  // --- MÉTODOS CRUD ---
  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editandoId) await pokemonService.actualizar(formData);
      else await pokemonService.agregar(formData);
      limpiarFormulario();
      cargarPokemones(); 
    } catch (error) { console.error("Error guardando:", error); }
  };

  const handleBorrar = async (id?: number) => {
    if (!id || !window.confirm("¿Seguro que quieres liberar a este Pokémon?")) return;
    try {
      await pokemonService.borrar(id);
      cargarPokemones();
      if (statusSeleccionado?.id === id) setStatusSeleccionado(null);
    } catch (error) { console.error("Error borrando:", error); }
  };

  const iniciarEdicion = (pokemon: PokemonDTO) => {
    setEditandoId(pokemon.id || null);
    setFormData({ ...pokemon });
  };

  const limpiarFormulario = () => {
    setEditandoId(null);
    setFormData({ nombre: '', tipo: '', nivel: 1 });
  };

  const verStatus = async (id?: number) => {
    if (!id) return;
    try {
      const dataStatus = await pokemonService.obtenerStatus(id);
      setStatusSeleccionado(dataStatus);
    } catch (error) { console.error("Error obteniendo status:", error); }
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Gestor de Pokémon</h1>

      {/* --- FORMULARIO CREAR/EDITAR --- */}
      <div className="card">
        <h3 className="card-title">{editandoId ? 'Actualizar Registro' : 'Capturar Nuevo'}</h3>
        <form onSubmit={handleGuardar} className="form-group">
          <input type="text" className="input-control" placeholder="Nombre del Pokémon" required value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} />
          <input type="text" className="input-control" placeholder="Tipo (Ej: Fuego)" required value={formData.tipo} onChange={(e) => setFormData({...formData, tipo: e.target.value})} />
          <input type="number" className="input-control" placeholder="Nivel" required min="1" style={{maxWidth: '100px'}} value={formData.nivel} onChange={(e) => setFormData({...formData, nivel: Number(e.target.value)})} />
          
          <button type="submit" className={`btn ${editandoId ? 'btn-primary' : 'btn-success'}`}>
            {editandoId ? 'Guardar Cambios' : 'Registrar Pokémon'}
          </button>
          
          {editandoId && (
            <button type="button" className="btn btn-outline" onClick={limpiarFormulario}>Cancelar</button>
          )}
        </form>
      </div>

      {/* --- FILTROS DINÁMICOS --- */}
      <div className="card">
        <h3 className="card-title" style={{color: 'var(--info)'}}>Filtros Avanzados</h3>
        
        {filtros.map((filtro, index) => (
          <div key={index} className="form-group" style={{ marginBottom: '1rem' }}>
            <select className="input-control" style={{maxWidth: '150px'}} value={filtro.campo} onChange={(e) => actualizarFiltro(index, 'campo', e.target.value)}>
              <option value="NOMBRE">Nombre</option>
              <option value="TIPO">Tipo</option>
              <option value="NIVEL">Nivel</option>
            </select>

            <select className="input-control" style={{maxWidth: '180px'}} value={filtro.operador} onChange={(e) => actualizarFiltro(index, 'operador', e.target.value)}>
              <option value="LIKE">Contiene (LIKE)</option>
              <option value="=">Igual (=)</option>
              <option value=">">Mayor que (&gt;)</option>
              <option value="<">Menor que (&lt;)</option>
            </select>

            <input 
              type={filtro.campo === 'NIVEL' ? 'number' : 'text'} 
              className="input-control"
              placeholder="Valor del filtro..." 
              value={filtro.valor} 
              onChange={(e) => actualizarFiltro(index, 'valor', e.target.value)}
            />

            <button type="button" className="btn btn-danger" onClick={() => eliminarFiltro(index)}>✕</button>
          </div>
        ))}

        <div className="form-group" style={{marginTop: '1.5rem'}}>
          <button type="button" className="btn btn-outline" onClick={agregarFiltro}>+ Añadir Condición</button>
          <button onClick={aplicarFiltros} className="btn btn-info">Aplicar Búsqueda</button>
          {filtros.length > 0 && <button onClick={limpiarFiltros} className="btn btn-outline">Limpiar Todo</button>}
        </div>
      </div>

      {/* --- TARJETA DE STATUS --- */}
      {statusSeleccionado && (
        <div className="card status-panel">
          <h3 className="card-title" style={{color: 'var(--warning)', borderBottomColor: 'rgba(245, 158, 11, 0.3)'}}>
            Reporte de Estado: {statusSeleccionado.nombre}
          </h3>
          <div className="status-grid">
            <div className="status-item">
              <span>Nivel Base</span>
              <strong>{statusSeleccionado.nivel}</strong>
            </div>
            <div className="status-item">
              <span>Entrenador Actual</span>
              <strong>{statusSeleccionado.nombreEntrenador}</strong>
            </div>
            <div className="status-item">
              <span>Poder Total (Calculado)</span>
              <strong>{statusSeleccionado.poderTotal}</strong>
            </div>
            <div className="status-item">
              <span>Clasificación</span>
              <strong style={{ color: statusSeleccionado.esLegendario ? 'var(--warning)' : 'var(--text-primary)' }}>
                {statusSeleccionado.esLegendario ? '⭐ LEGENDARIO' : 'Normal'}
              </strong>
            </div>
          </div>
          <div style={{marginTop: '1.5rem', textAlign: 'right'}}>
            <button onClick={() => setStatusSeleccionado(null)} className="btn btn-outline">Cerrar Panel</button>
          </div>
        </div>
      )}

      {/* --- TABLA DE DATOS --- */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Nivel</th>
              <th style={{textAlign: 'right'}}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pokemones.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>No se encontraron registros en la base de datos.</td></tr>
            ) : (
              pokemones.map((p) => (
                <tr key={p.id}>
                  <td style={{fontWeight: '600', color: 'var(--text-secondary)'}}>#{p.id}</td>
                  <td style={{fontWeight: '500'}}>{p.nombre}</td>
                  <td><span style={{ backgroundColor: 'var(--bg-base)', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.85rem' }}>{p.tipo}</span></td>
                  <td>{p.nivel}</td>
                  <td style={{textAlign: 'right'}}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button onClick={() => iniciarEdicion(p)} className="btn btn-primary" style={{padding: '0.4rem 0.8rem', fontSize: '0.85rem'}}>Editar</button>
                      <button onClick={() => verStatus(p.id)} className="btn btn-warning" style={{padding: '0.4rem 0.8rem', fontSize: '0.85rem'}}>Status</button>
                      <button onClick={() => handleBorrar(p.id)} className="btn btn-danger" style={{padding: '0.4rem 0.8rem', fontSize: '0.85rem'}}>Borrar</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;