import { NextApiRequest, NextApiResponse } from 'next';
import { Subprocesso } from '@/entities/Subprocesso';
import { Processo } from '@/entities/Processo';
import { AppDataSource } from '@/lib/data-source';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
        console.log('✅ Conexão com o banco de dados estabelecida');
    }

    const subprocessoRepository = AppDataSource.getRepository(Subprocesso);
    const processoRepository = AppDataSource.getRepository(Processo);
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'ID inválido' });
    }

    const subprocesso = await subprocessoRepository.findOne({ where: { id: Number(id) } });
    if (!subprocesso) {
        return res.status(404).json({ error: 'Subprocesso não encontrado' });
    }

    switch (req.method) {
        case 'PUT':
            const { nome, descricao, processoId, subprocessoPaiId } = req.body;
            if (!nome || !processoId) {
                return res.status(400).json({ error: 'Nome e ID do processo são obrigatórios' });
            }

            // Verifica se o processo existe
            const processo = await processoRepository.findOne({ where: { id: processoId } });
            if (!processo) {
                return res.status(404).json({ error: 'Processo não encontrado' });
            }

            // Se tiver subprocesso pai, verifica se existe
            if (subprocessoPaiId) {
                const subprocessoPai = await subprocessoRepository.findOne({ where: { id: subprocessoPaiId } });
                if (!subprocessoPai) {
                    return res.status(404).json({ error: 'Subprocesso pai não encontrado' });
                }
            }

            subprocesso.nome = nome;
            subprocesso.descricao = descricao;
            subprocesso.processoId = processoId;
            subprocesso.subprocessoPaiId = subprocessoPaiId;

            await subprocessoRepository.save(subprocesso);
            return res.status(200).json(subprocesso);

        case 'DELETE':
            await subprocessoRepository.remove(subprocesso);
            return res.status(200).json({ message: 'Subprocesso removido com sucesso' });

        default:
            return res.status(405).json({ error: 'Método não permitido' });
    }
} 