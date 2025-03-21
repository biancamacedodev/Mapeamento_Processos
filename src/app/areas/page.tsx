"use client"
import { Processo } from '@/entities/Processo';
import styles from '@/styles/Areas.module.css';
import { useState, useEffect } from 'react';

export interface Area {
  id: number;
  nome: string;
  descricao?: string;
  processos?: Processo[];
}

export default function AreasPage() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: ''
  });

  useEffect(() => {
    fetchAreas();
  }, []);

  const fetchAreas = async () => {
    try {
      const res = await fetch('/api/areas');
      if (!res.ok) throw new Error('Falha ao carregar áreas');
      const data = await res.json();
      setAreas(data);
    } catch (err) {
      setError('Erro ao carregar áreas');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/areas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!res.ok) throw new Error('Falha ao criar área');
      
      const novaArea = await res.json();
      setAreas([...areas, novaArea]);
      setFormData({ nome: '', descricao: '' });
    } catch (err) {
      setError('Erro ao criar área');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta área?')) return;
    
    try {
      const res = await fetch(`/api/areas/${id}`, {
        method: 'DELETE'
      });
      
      if (!res.ok) throw new Error('Falha ao excluir área');
      
      setAreas(areas.filter(area => area.id !== id));
    } catch (err) {
      setError('Erro ao excluir área');
    }
  };

  if (loading) return <div className={styles.loading}>Carregando...</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Gestão de Áreas</h1>
      
      {error && <div className={styles.error}>{error}</div>}
      
      <div className={styles.formContainer}>
        <h2>Nova Área</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="nome">Nome da Área:</label>
            <input 
              type="text" 
              id="nome" 
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              placeholder="Ex: Recursos Humanos"
              required 
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="descricao">Descrição:</label>
            <textarea 
              id="descricao" 
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              placeholder="Descreva brevemente a área"
            />
          </div>
          <button type="submit" className={styles.buttonPrimary}>
            Cadastrar Área
          </button>
        </form>
      </div>

      <div className={styles.listContainer}>
        <h2>Áreas Cadastradas</h2>
        {areas.length === 0 ? (
          <div className={styles.empty}>Nenhuma área cadastrada</div>
        ) : (
          <div className={styles.grid}>
            {areas.map((area: Area) => (
              <div key={area.id} className={styles.card}>
                <h3>{area.nome}</h3>
                {area.descricao && <p>{area.descricao}</p>}
                <div className={styles.cardActions}>
                  <button className={styles.buttonSecondary}>
                    Editar
                  </button>
                  <button 
                    className={styles.buttonDanger}
                    onClick={() => handleDelete(area.id)}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 