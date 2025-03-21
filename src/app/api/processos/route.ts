

import { NextResponse } from 'next/server';
import { AppDataSource } from '@/lib/data-source';
import { Processo } from '@/entities/Processo';

export async function GET() {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const processoRepository = AppDataSource.getRepository(Processo);
    const processos = await processoRepository.find({ relations: ['area'] });

    return NextResponse.json(processos);
  } catch (error) {
    console.error('Erro ao buscar processos:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar processos' },
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
    const { nome, descricao, ferramentas, responsaveis, documentacao, areaId } = body;

    if (!nome || !descricao || !areaId) {
      return NextResponse.json(
        { error: 'Nome, descrição e área são obrigatórios' },
        { status: 400 }
      );
    }

    const processoRepository = AppDataSource.getRepository(Processo);
    const processo = processoRepository.create({
      nome,
      descricao,
      ferramentas,
      responsaveis,
      documentacao,
      areaId
    });

    await processoRepository.save(processo);

    return NextResponse.json(processo, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar processo:', error);
    return NextResponse.json(
      { error: 'Erro ao criar processo' },
      { status: 500 }
    );
  }
} 