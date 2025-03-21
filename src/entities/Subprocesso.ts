import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import type { Processo } from "@/types/entities";

@Entity()
export class Subprocesso {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nome!: string;

  @Column()
  descricao!: string;

  @ManyToOne("Processo", (processo: { subprocessos: Subprocesso[] }) => processo.subprocessos)
  processo!: Processo;

  @Column()
  processoId!: number;

  @Column({ nullable: true })
  subprocessoPaiId?: number;
} 