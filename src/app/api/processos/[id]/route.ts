import { NextResponse } from 'next/server';
import { AppDataSource } from '@/lib/data-source';
import { Processo } from '@/entities/Processo';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const id = parseInt(params.id);
    const processoRepository = AppDataSource.getRepository(Processo);
    const processo = await processoRepository.findOne({
      where: { id },
      relations: ['area']
    });

    if (!processo) {
      return NextResponse.json(
        { error: 'Processo não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(processo);
  } catch (error) {
    console.error('Erro ao buscar processo:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar processo' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const id = parseInt(params.id);
    const body = await request.json();
    const { nome, descricao, ferramentas, responsaveis, documentacao, areaId } = body;

    const processoRepository = AppDataSource.getRepository(Processo);
    const processo = await processoRepository.findOne({ where: { id } });

    if (!processo) {
      return NextResponse.json(
        { error: 'Processo não encontrado' },
        { status: 404 }
      );
    }

    processo.nome = nome || processo.nome;
    processo.descricao = descricao || processo.descricao;
    processo.ferramentas = ferramentas || processo.ferramentas;
    processo.responsaveis = responsaveis || processo.responsaveis;
    processo.documentacao = documentacao || processo.documentacao;
    processo.areaId = areaId || processo.areaId;

    await processoRepository.save(processo);

    return NextResponse.json(processo);
  } catch (error) {
    console.error('Erro ao atualizar processo:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar processo' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const id = parseInt(params.id);
    const processoRepository = AppDataSource.getRepository(Processo);
    const processo = await processoRepository.findOne({ where: { id } });

    if (!processo) {
      return NextResponse.json(
        { error: 'Processo não encontrado' },
        { status: 404 }
      );
    }

    await processoRepository.remove(processo);

    return NextResponse.json(
      { message: 'Processo removido com sucesso' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro ao remover processo:', error);
    return NextResponse.json(
      { error: 'Erro ao remover processo' },
      { status: 500 }
    );
  }
} 