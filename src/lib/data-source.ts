import { Area } from '@/entities/Area';
import { Processo } from '@/entities/Processo';
import { Subprocesso } from '@/entities/Subprocesso';

import { DataSource } from 'typeorm';


// Configuração do banco de dados
export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root', // Altere conforme suas credenciais
  password: 'root', // Altere conforme suas credenciais
  database: 'mapeamento_processos',
  synchronize: true, // Em produção, defina como false e use migrations
  logging: true,
  // Importante: ordem das entidades para evitar referência circular
  entities: [Area, Processo, Subprocesso],
  subscribers: [],
  migrations: []
});

// Função para inicializar o banco de dados
export async function initializeDatabase() {
  try {
    await AppDataSource.initialize();
    console.log('✅ Banco de dados MySQL conectado com sucesso');
  } catch (error) {
    console.error('❌ Erro ao conectar com o banco de dados:', error);
    throw error;
  }
}
