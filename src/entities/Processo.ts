import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import type { Area, Subprocesso } from "@/types/entities";

@Entity()
export class Processo {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nome!: string;

  @Column()
  descricao!: string;

  @Column()
  ferramentas!: string;

  @Column()
  responsaveis!: string;

  @Column()
  documentacao!: string;

  @ManyToOne("Area", (area: { processos: Processo[] }) => area.processos)
  area!: Area;

  @Column()
  areaId!: number;

  @OneToMany("Subprocesso", (subprocesso: { processo: Processo }) => subprocesso.processo)
  subprocessos!: Subprocesso[];
} 