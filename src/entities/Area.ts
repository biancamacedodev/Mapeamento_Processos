import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import type { Processo } from "@/types/entities";

@Entity()
export class Area {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    nome!: string;

    @Column({ nullable: true })
    descricao!: string;

    @OneToMany("Processo", (processo: { area: Area }) => processo.area)
    processos!: Processo[];
}
  