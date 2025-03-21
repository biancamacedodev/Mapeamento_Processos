"use client";
import { useState, useEffect } from 'react';
import { Area } from '@/entities/Area';
import styles from '@/styles/CadeiaProcessos.module.css';
import Link from 'next/link';


interface ProcessoData {
    id: number;
    nome: string;
    descricao: string;
    ferramentas: string[];
    responsaveis: string[];
    documentacao: string;
    subprocessos: {
        id: number;
        nome: string;
        descricao: string;
        subprocessoPaiId: number | null;
    }[];
}

interface AreaData {
    id: number;
    nome: string;
    descricao: string;
    processos: ProcessoData[];
}

export default function CadeiaProcessosPage() {
    const [dados, setDados] = useState<AreaData[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [areas, setAreas] = useState<Area[]>([]);
    const [areaSelecionada, setAreaSelecionada] = useState<number | null>(null);

    useEffect(() => {
        fetchDados();
        fetchAreas();
    }, []);

    const fetchDados = async () => {
        try {
            const response = await fetch('/api/cadeia-processos');
            if (!response.ok) throw new Error('Erro ao carregar dados');
            const data = await response.json();
            const dadosProcessados = (data as AreaData[]).map(area => ({
                ...area,
                processos: area.processos.map(processo => ({
                    ...processo,
                    ferramentas: Array.isArray(processo.ferramentas) ? processo.ferramentas : [],
                    responsaveis: Array.isArray(processo.responsaveis) ? processo.responsaveis : []
                }))
            }));
            setDados(dadosProcessados);
        } catch (err) {
            setError('Erro ao carregar dados');
            console.error('Erro ao buscar cadeia de processos:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAreas = async () => {
        try {
            const response = await fetch('/api/areas');
            if (!response.ok) throw new Error('Erro ao carregar áreas');
            const data = await response.json();
            setAreas(data);
        } catch (err) {
            setError('Erro ao carregar áreas');
        }
    };

    if (loading) return <div className={styles.loading}>Carregando...</div>;
    if (error) return <div className={styles.error}>{error}</div>;
    if (!dados || dados.length === 0) {
        return <div className={styles.error}>Nenhum dado encontrado</div>;
    }

    const areasFiltradas = areaSelecionada
        ? dados.filter(area => area.id === areaSelecionada)
        : dados;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Link href="/" className={styles.backLink}>
                    ← Voltar para Página Inicial
                </Link>
                <h1 className={styles.title}>Cadeia de Processos</h1>
            </div>

            <div className={styles.filters}>
                <label htmlFor="area" className={styles.filterLabel}>
                    Filtrar por Área:
                </label>
                <select
                    id="area"
                    value={areaSelecionada || ''}
                    onChange={(e) => setAreaSelecionada(e.target.value ? Number(e.target.value) : null)}
                    className={styles.filterSelect}
                >
                    <option value="">Todas as Áreas</option>
                    {areas.map(area => (
                        <option key={area.id} value={area.id}>
                            {area.nome}
                        </option>
                    ))}
                </select>
            </div>

            <div className={styles.treeContainer}>
                {areasFiltradas.map(area => (
                    <div key={area.id} className={styles.area}>
                        <div className={styles.node}>
                            <h2>{area.nome}</h2>
                            {area.descricao && <p>{area.descricao}</p>}
                        </div>
                        <div className={styles.processos}>
                            {area.processos.map(processo => (
                                <div key={processo.id} className={styles.processo}>
                                    <div className={styles.node}>
                                        <strong><h3>{processo.nome}</h3> </strong>
                                        {processo.descricao && <p>{processo.descricao}</p>}
                                        {(processo.ferramentas && Array.isArray(processo.ferramentas) && processo.ferramentas.length > 0) && (
                                            <div className={styles.detalhes}>
                                                <strong>Ferramentas:</strong>
                                                <ul>
                                                    {processo.ferramentas.map((ferramenta, index) => (
                                                        <li key={index}>{ferramenta}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        {processo.responsaveis.length > 0 && (
                                            <div className={styles.detalhes}>
                                                <strong>Responsáveis:</strong>
                                                <ul>
                                                    {processo.responsaveis.map((responsavel, index) => (
                                                        <li key={index}>{responsavel}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        {processo.documentacao && (
                                            <div className={styles.detalhes}>
                                                <strong>Documentação:</strong>
                                                <p>{processo.documentacao}</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className={styles.subprocessos}>
                                        {processo.subprocessos.map(subprocesso => (
                                            <div key={subprocesso.id} className={styles.subprocesso}>
                                                <div className={styles.node}>
                                                <strong><h4>{subprocesso.nome}</h4></strong>
                                                    {subprocesso.descricao && <p>{subprocesso.descricao}</p>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}