import { NextResponse } from 'next/server';
import { AppDataSource } from '@/lib/data-source';
import { Area } from '@/entities/Area';

export async function GET() {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const areaRepository = AppDataSource.getRepository(Area);
    const areas = await areaRepository.find();

    return NextResponse.json(areas);
  } catch (error) {
    console.error('Erro ao buscar áreas:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar áreas' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { nome, descricao } = data;

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
    const area = areaRepository.create({
      nome,
      descricao: descricao || ''
    });

    const savedArea = await areaRepository.save(area);
    return NextResponse.json(savedArea, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar área:', error);
    return NextResponse.json(
      { error: 'Erro ao criar área' },
      { status: 500 }
    );
  }
} 