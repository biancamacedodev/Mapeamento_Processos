"use client";
import { useState, useEffect } from 'react';
import { Processo } from '@/entities/Processo';
import styles from '@/styles/Subprocessos.module.css';
import Link from 'next/link';

export interface Subprocesso {
    id: number;
    nome: string;
    descricao: string;
    processo?: Processo;
    processoId: number;
    subprocessoPaiId?: number;
} 


export default function SubprocessosPage() {
    const [subprocessos, setSubprocessos] = useState<Subprocesso[]>([]);
    const [processos, setProcessos] = useState<Processo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [editSubprocesso, setEditSubprocesso] = useState<Subprocesso | null>(null);
    const [formData, setFormData] = useState({
        nome: '',
        descricao: '',
        processoId: '',
        subprocessoPaiId: ''
    });

    useEffect(() => {
        fetchSubprocessos();
        fetchProcessos();
    }, []);

    const fetchSubprocessos = async () => {
        try {
            const response = await fetch('/api/subprocessos');
            if (!response.ok) throw new Error('Erro ao carregar subprocessos');
            const data = await response.json();
            setSubprocessos(data);
        } catch (err) {
            setError('Erro ao carregar subprocessos');
        } finally {
            setLoading(false);
        }
    };

    const fetchProcessos = async () => {
        try {
            const response = await fetch('/api/processos');
            if (!response.ok) throw new Error('Erro ao carregar processos');
            const data = await response.json();
            setProcessos(data);
        } catch (err) {
            setError('Erro ao carregar processos');
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if(!formData.nome.trim() || !formData.processoId) {
            setError('Nome e processo são obrigatórios');
            return;
        }

        try {
            const newSubprocesso = {
                nome: formData.nome.trim(),
                descricao: formData.descricao.trim(),
                processoId: Number(formData.processoId),
                subprocessoPaiId: formData.subprocessoPaiId ? Number(formData.subprocessoPaiId) : null
            };

            if(editSubprocesso) {
                const response = await fetch(`/api/subprocessos/${editSubprocesso.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newSubprocesso)
                });

                if (!response.ok) throw new Error('Erro ao atualizar subprocesso');
                
                const updateSubprocesso = await response.json();
                setSubprocessos(subprocessos.map(sub => sub.id === editSubprocesso.id ? updateSubprocesso : sub));
                setSuccess('Subprocesso atualizado com sucesso!');
            } else {
                const response = await fetch('/api/subprocessos', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newSubprocesso)
                });

                if (!response.ok) throw new Error('Erro ao criar subprocesso');
                
                const subprocessoCriado = await response.json();
                setSubprocessos([...subprocessos, subprocessoCriado]);
                setSuccess('Subprocesso criado com sucesso!');
            }

            setFormData({
                nome: '',
                descricao: '',
                processoId: '',
                subprocessoPaiId: ''
            });
            setEditSubprocesso(null);
        } catch (err) {
            setError(editSubprocesso ? 'Erro ao atualizar subprocesso' : 'Erro ao criar subprocesso');
        }
    };

    const handleEdit = (subprocesso: Subprocesso) => {
        setEditSubprocesso(subprocesso);
        setFormData({
            nome: subprocesso.nome,
            descricao: subprocesso.descricao || '',
            processoId: subprocesso.processoId.toString(),
            subprocessoPaiId: subprocesso.subprocessoPaiId?.toString() || ''
        });
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Tem certeza que deseja excluir este subprocesso?')) return;

        try {
            const response = await fetch(`/api/subprocessos/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Erro ao excluir subprocesso');

            setSubprocessos(subprocessos.filter(sub => sub.id !== id));
            setSuccess('Subprocesso excluído com sucesso!');
        } catch (err) {
            setError('Erro ao excluir subprocesso');
        }
    };

    if (loading) return <div className={styles.loading}>Carregando...</div>;

    return (
        <div className={styles.container}>
             <div className={styles.header}>
                <Link href="/" className={styles.backLink}>
                    ← Voltar para Página Inicial
                </Link>
                <h1 className={styles.title}>Gerenciar Subprocessos</h1>
            </div>
            
            {error && <div className={styles.error}>{error}</div>}
            {success && <div className={styles.success}>{success}</div>}

            <div className={styles.formContainer}>
                <h2>{editSubprocesso ? 'Editar Subprocesso' : 'Novo Subprocesso'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.field}>
                        <label htmlFor="nome">Nome:</label>
                        <input
                            type="text"
                            id="nome"
                            value={formData.nome}
                            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                            placeholder="Nome do subprocesso"
                        />
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="descricao">Descrição:</label>
                        <textarea
                            id="descricao"
                            value={formData.descricao}
                            onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                            placeholder="Descrição do subprocesso"
                        />
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="processoId">Processo:</label>
                        <select
                            id="processoId"
                            value={formData.processoId}
                            onChange={(e) => setFormData({ ...formData, processoId: e.target.value })}
                        >
                            <option value="">Selecione um processo</option>
                            {processos.map(processo => (
                                <option key={processo.id} value={processo.id}>
                                    {processo.nome}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="subprocessoPaiId">Subprocesso Pai (opcional):</label>
                        <select
                            id="subprocessoPaiId"
                            value={formData.subprocessoPaiId}
                            onChange={(e) => setFormData({ ...formData, subprocessoPaiId: e.target.value })}
                        >
                            <option value="">Nenhum</option>
                            {subprocessos.map(sub => (
                                <option key={sub.id} value={sub.id}>
                                    {sub.nome}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.actions}>
                        <button type="submit" className={styles.button}>
                            {editSubprocesso ? 'Atualizar' : 'Criar'}
                        </button>
                        {editSubprocesso && (
                            <button
                                type="button"
                                className={styles.buttonCancel}
                                onClick={() => {
                                    setEditSubprocesso(null);
                                    setFormData({
                                        nome: '',
                                        descricao: '',
                                        processoId: '',
                                        subprocessoPaiId: ''
                                    });
                                }}
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className={styles.listContainer}>
                <h2>Subprocessos Cadastrados</h2>
                {subprocessos.length === 0 ? (
                    <p className={styles.empty}>Nenhum subprocesso cadastrado.</p>
                ) : (
                    <div className={styles.grid}>
                        {subprocessos.map(subprocesso => (
                            <div key={subprocesso.id} className={styles.card}>
                                <h3>{subprocesso.nome}</h3>
                                {subprocesso.descricao && <p>{subprocesso.descricao}</p>}
                                <p>Processo: {processos.find(p => p.id === subprocesso.processoId)?.nome}</p>
                                {subprocesso.subprocessoPaiId && (
                                    <p>Subprocesso Pai: {subprocessos.find(s => s.id === subprocesso.subprocessoPaiId)?.nome}</p>
                                )}
                                <div className={styles.cardActions}>
                                    <button
                                        onClick={() => handleEdit(subprocesso)}
                                        className={styles.buttonEdit}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(subprocesso.id)}
                                        className={styles.buttonDelete}
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