"use client";
import { Area } from "@/entities/Area";
import { useEffect, useState } from "react";
import styles from '@/styles/Processos.module.css';
import Link from "next/link";
import { Subprocesso } from "@/entities/Subprocesso";


export interface Processo {
    id: number;
    nome: string;
    descricao: string;
    ferramentas: string;
    responsaveis: string;
    documentacao: string;
    area?: Area;
    areaId: number;
    subprocessos?: Subprocesso[];
}

const ProcessosPage = () => {
    const [processos, setProcessos] = useState<Processo[]>([]);
    const [areas, setAreas] = useState<Area[]>([]);
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [areaId, setAreaId] = useState('');
    const [ferramentas, setFerramentas] = useState('');
    const [responsaveis, setResponsaveis] = useState('');
    const [documentacao, setDocumentacao] = useState('');
    const [editProcesso, setEditProcesso] = useState<Processo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const fetchProcessos = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/processos");
            if (!response.ok) throw new Error('Erro ao carregar processos');
            const data = await response.json();
            setProcessos(data);
        } catch (err) {
            setError('Erro ao carregar processos. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const fetchAreas = async () => {
        try {
            const response = await fetch("/api/areas");
            if (!response.ok) throw new Error('Erro ao carregar áreas');
            const data = await response.json();
            setAreas(data);
        } catch (err) {
            setError('Erro ao carregar áreas. Tente novamente.');
        }
    };

    useEffect(() => {
        fetchProcessos();
        fetchAreas();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if(!nome.trim() || !areaId) {
            setError('Nome e área são obrigatórios');
            return;
        }

        try {
            const processo = {
                nome: nome.trim(),
                descricao: descricao.trim(),
                areaId: Number(areaId),
                ferramentas: ferramentas.trim(),
                responsaveis: responsaveis.trim(),
                documentacao: documentacao.trim()
            };

            if(editProcesso) {
                const response = await fetch(`/api/processos/${editProcesso.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(processo),
                });

                if (!response.ok) throw new Error('Erro ao atualizar processo');
                
                const processoAtualizado = await response.json();
                setProcessos(processos.map(p => p.id === editProcesso.id ? processoAtualizado : p));
                setSuccess('Processo atualizado com sucesso!');
            } else {
                const response = await fetch("/api/processos", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(processo),
                });

                if (!response.ok) throw new Error('Erro ao criar processo');
                
                const novoProcesso = await response.json();
                setProcessos([...processos, novoProcesso]);
                setSuccess('Processo criado com sucesso!');
            }

            setNome('');
            setDescricao('');
            setAreaId('');
            setFerramentas('');
            setResponsaveis('');
            setDocumentacao('');
            setEditProcesso(null);
        } catch (err) {
            setError(editProcesso ? 'Erro ao atualizar processo' : 'Erro ao criar processo');
        }
    };

    const handleEdit = (processo: Processo) => {
        setEditProcesso(processo);
        setNome(processo.nome);
        setDescricao(processo.descricao || '');
        setAreaId(processo.areaId.toString());
        setFerramentas(processo.ferramentas || '');
        setResponsaveis(processo.responsaveis || '');
        setDocumentacao(processo.documentacao || '');
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Tem certeza que deseja excluir este processo?')) return;

        try {
            const response = await fetch(`/api/processos/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error('Erro ao excluir processo');

            setProcessos(processos.filter(p => p.id !== id));
            setSuccess('Processo excluído com sucesso!');
        } catch (err) {
            setError('Erro ao excluir processo');
        }
    };

    return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <Link href="/" className={styles.backLink}>
                        ← Voltar para Página Inicial
                    </Link>
                    <h1 className={styles.title}>Gestão de Processos</h1>
                </div>
                {error && <div className={styles.error}>{error}</div>}
                {success && <div className={styles.success}>{success}</div>}

                <div className={styles.formContainer}>
                    <h2>{editProcesso ? 'Editar' : 'Novo'} Processo</h2>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.field}>
                            <label htmlFor="nome">Nome do Processo:</label>
                            <input 
                                type="text" 
                                id="nome" 
                                value={nome} 
                                onChange={(e) => setNome(e.target.value)}
                                placeholder="Ex: Recrutamento e Seleção"
                                required 
                            />
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="areaId">Área:</label>
                            <select 
                                id="areaId" 
                                value={areaId} 
                                onChange={(e) => setAreaId(e.target.value)}
                                required
                            >
                                <option value="">Selecione uma área</option>
                                {areas.map(area => (
                                    <option key={area.id} value={area.id}>
                                        {area.nome}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="descricao">Descrição:</label>
                            <textarea 
                                id="descricao" 
                                value={descricao} 
                                onChange={(e) => setDescricao(e.target.value)}
                                placeholder="Descreva o processo"
                            />
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="ferramentas">Ferramentas Utilizadas:</label>
                            <textarea 
                                id="ferramentas" 
                                value={ferramentas} 
                                onChange={(e) => setFerramentas(e.target.value)}
                                placeholder="Liste as ferramentas utilizadas"
                            />
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="responsaveis">Responsáveis:</label>
                            <textarea 
                                id="responsaveis" 
                                value={responsaveis} 
                                onChange={(e) => setResponsaveis(e.target.value)}
                                placeholder="Liste os responsáveis"
                            />
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="documentacao">Documentação:</label>
                            <textarea 
                                id="documentacao" 
                                value={documentacao} 
                                onChange={(e) => setDocumentacao(e.target.value)}
                                placeholder="Descreva a documentação necessária"
                            />
                        </div>

                        <div className={styles.actions}>
                            {editProcesso && (
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        setEditProcesso(null);
                                        setNome('');
                                        setDescricao('');
                                        setAreaId('');
                                        setFerramentas('');
                                        setResponsaveis('');
                                        setDocumentacao('');
                                    }}
                                    className={styles.buttonSecondary}
                                >
                                    Cancelar
                                </button>
                            )}
                            <button type="submit" className={styles.buttonPrimary}>
                                {editProcesso ? 'Salvar Alterações' : 'Cadastrar Processo'}
                            </button>
                        </div>
                    </form>
                </div>

                <div className={styles.listContainer}>
                    <h2>Processos Cadastrados</h2>
                    {loading ? (
                        <div className={styles.loading}>Carregando processos...</div>
                    ) : processos.length === 0 ? (
                        <div className={styles.empty}>Nenhum processo cadastrado</div>
                    ) : (
                        <div className={styles.grid}>
                            {processos.map((processo) => (
                                <div key={processo.id} className={styles.card}>
                                    <h3>{processo.nome}</h3>
                                    <p className={styles.area}>
                                        Área: {areas.find(a => a.id === processo.areaId)?.nome}
                                    </p>
                                    {processo.descricao && <p>{processo.descricao}</p>}
                                    {processo.ferramentas && (
                                        <div className={styles.detail}>
                                            <strong>Ferramentas:</strong> {processo.ferramentas}
                                        </div>
                                    )}
                                    {processo.responsaveis && (
                                        <div className={styles.detail}>
                                            <strong>Responsáveis:</strong> {processo.responsaveis}
                                        </div>
                                    )}
                                    {processo.documentacao && (
                                        <div className={styles.detail}>
                                            <strong>Documentação:</strong> {processo.documentacao}
                                        </div>
                                    )}
                                    <div className={styles.cardActions}>
                                        <button 
                                            onClick={() => handleEdit(processo)}
                                            className={styles.buttonSecondary}
                                        >
                                            Editar
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(processo.id)}
                                            className={styles.buttonDanger}
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

export default ProcessosPage;
