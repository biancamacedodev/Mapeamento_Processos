import { NextResponse } from 'next/server';
import { AppDataSource } from '@/lib/data-source';
import { Subprocesso } from '@/entities/Subprocesso';

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const id = parseInt(context.params.id);
    const subprocessoRepository = AppDataSource.getRepository(Subprocesso);
    const subprocesso = await subprocessoRepository.findOne({
      where: { id },
      relations: ['processo', 'processo.area']
    });

    if (!subprocesso) {
      return NextResponse.json(
        { error: 'Subprocesso não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(subprocesso);
  } catch (error) {
    console.error('Erro ao buscar subprocesso:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar subprocesso' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const id = parseInt(context.params.id);
    const body = await request.json();
    const { nome, descricao, processoId } = body;

    const subprocessoRepository = AppDataSource.getRepository(Subprocesso);
    const subprocesso = await subprocessoRepository.findOne({ where: { id } });

    if (!subprocesso) {
      return NextResponse.json(
        { error: 'Subprocesso não encontrado' },
        { status: 404 }
      );
    }

    subprocesso.nome = nome || subprocesso.nome;
    subprocesso.descricao = descricao || subprocesso.descricao;
    subprocesso.processoId = processoId || subprocesso.processoId;

    await subprocessoRepository.save(subprocesso);

    return NextResponse.json(subprocesso);
  } catch (error) {
    console.error('Erro ao atualizar subprocesso:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar subprocesso' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const id = parseInt(context.params.id);
    const subprocessoRepository = AppDataSource.getRepository(Subprocesso);
    const subprocesso = await subprocessoRepository.findOne({ where: { id } });

    if (!subprocesso) {
      return NextResponse.json(
        { error: 'Subprocesso não encontrado' },
        { status: 404 }
      );
    }

    await subprocessoRepository.remove(subprocesso);

    return NextResponse.json(
      { message: 'Subprocesso removido com sucesso' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro ao remover subprocesso:', error);
    return NextResponse.json(
      { error: 'Erro ao remover subprocesso' },
      { status: 500 }
    );
  }
} 