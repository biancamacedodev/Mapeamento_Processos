import { NextResponse } from 'next/server';
import { AppDataSource } from '@/lib/data-source';
import { Subprocesso } from '@/entities/Subprocesso';

export async function GET() {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const subprocessoRepository = AppDataSource.getRepository(Subprocesso);
    const subprocessos = await subprocessoRepository.find({
      relations: ['processo', 'processo.area']
    });

    return NextResponse.json(subprocessos);
  } catch (error) {
    console.error('Erro ao buscar subprocessos:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar subprocessos' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const body = await request.json();
    const { nome, descricao, processoId } = body;

    if (!nome || !processoId) {
      return NextResponse.json(
        { error: 'Nome e processo são obrigatórios' },
        { status: 400 }
      );
    }

    const subprocessoRepository = AppDataSource.getRepository(Subprocesso);
    const subprocesso = subprocessoRepository.create({
      nome,
      descricao: descricao || '',
      processoId
    });

    await subprocessoRepository.save(subprocesso);

    return NextResponse.json(subprocesso, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar subprocesso:', error);
    return NextResponse.json(
      { error: 'Erro ao criar subprocesso' },
      { status: 500 }
    );
  }
} 