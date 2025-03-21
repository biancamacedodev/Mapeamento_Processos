import { NextResponse } from 'next/server';
import { Processo } from '@/entities/Processo';
import { Subprocesso } from '@/entities/Subprocesso';
import { Area } from '@/entities/Area';
import { AppDataSource } from '@/lib/data-source';

export async function GET() {
    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
    }

    const processoRepository = AppDataSource.getRepository(Processo);
    const subprocessoRepository = AppDataSource.getRepository(Subprocesso);
    const areaRepository = AppDataSource.getRepository(Area);

    try {
        // Busca todas as áreas
        const areas = await areaRepository.find();
        
        // Para cada área, busca seus processos
        const cadeiaProcessos = await Promise.all(areas.map(async (area) => {
            const processos = await processoRepository.find({
                where: { areaId: area.id }
            });

            // Para cada processo, busca seus subprocessos
            const processosComSubprocessos = await Promise.all(processos.map(async (processo) => {
                const subprocessos = await subprocessoRepository.find({
                    where: { processoId: processo.id }
                });

                // Organiza os subprocessos em uma estrutura hierárquica
                const subprocessosHierarquicos = organizarSubprocessos(subprocessos);

                return {
                    id: processo.id,
                    nome: processo.nome,
                    descricao: processo.descricao,
                    ferramentas: processo.ferramentas,
                    responsaveis: processo.responsaveis,
                    documentacao: processo.documentacao,
                    subprocessos: subprocessosHierarquicos
                };
            }));

            return {
                id: area.id,
                nome: area.nome,
                descricao: area.descricao,
                processos: processosComSubprocessos
            };
        }));

        return NextResponse.json(cadeiaProcessos);
    } catch (error) {
        console.error('Erro ao buscar cadeia de processos:', error);
        return NextResponse.json({ error: 'Erro ao buscar cadeia de processos' }, { status: 500 });
    }
}

function organizarSubprocessos(subprocessos: Subprocesso[]): any[] {
    // Cria um mapa de subprocessos por ID
    const subprocessosMap = new Map(subprocessos.map(sp => [sp.id, sp]));
    const subprocessosRaiz: any[] = [];

    // Organiza os subprocessos em uma estrutura hierárquica
    subprocessos.forEach(subprocesso => {
        if (!subprocesso.subprocessoPaiId) {
            // É um subprocesso raiz
            subprocessosRaiz.push({
                id: subprocesso.id,
                nome: subprocesso.nome,
                descricao: subprocesso.descricao,
                subprocessos: buscarSubprocessosFilhos(subprocesso.id, subprocessosMap)
            });
        }
    });

    return subprocessosRaiz;
}

function buscarSubprocessosFilhos(paiId: number, subprocessosMap: Map<number, Subprocesso>): any[] {
    const filhos: any[] = [];
    
    subprocessosMap.forEach(subprocesso => {
        if (subprocesso.subprocessoPaiId === paiId) {
            filhos.push({
                id: subprocesso.id,
                nome: subprocesso.nome,
                descricao: subprocesso.descricao,
                subprocessos: buscarSubprocessosFilhos(subprocesso.id, subprocessosMap)
            });
        }
    });

    return filhos;
} 