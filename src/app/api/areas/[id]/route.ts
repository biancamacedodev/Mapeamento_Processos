import { NextResponse } from 'next/server';
import { Area } from '@/entities/Area';
import { AppDataSource } from '@/lib/data-source';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const areaRepository = AppDataSource.getRepository(Area);
    const area = await areaRepository.findOne({ where: { id } });

    if (!area) {
      return NextResponse.json(
        { error: 'Área não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(area);
  } catch (error) {
    console.error('Erro ao buscar área:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar área' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { nome, descricao } = body;

    if (!nome) {
      return NextResponse.json(
        { error: 'Nome é obrigatório' },
        { status: 400 }
      );
    }

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const areaRepository = AppDataSource.getRepository(Area);
    const area = await areaRepository.findOne({ where: { id } });

    if (!area) {
      return NextResponse.json(
        { error: 'Área não encontrada' },
        { status: 404 }
      );
    }

    area.nome = nome;
    area.descricao = descricao;

    await areaRepository.save(area);

    return NextResponse.json(area);
  } catch (error) {
    console.error('Erro ao atualizar área:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar área' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const areaRepository = AppDataSource.getRepository(Area);
    const area = await areaRepository.findOne({ where: { id } });

    if (!area) {
      return NextResponse.json(
        { error: 'Área não encontrada' },
        { status: 404 }
      );
    }

    await areaRepository.remove(area);

    return NextResponse.json({ message: 'Área removida com sucesso' });
  } catch (error) {
    console.error('Erro ao remover área:', error);
    return NextResponse.json(
      { error: 'Erro ao remover área' },
      { status: 500 }
    );
  }
} 