import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 40 })
  nickname!: string;

  @Column({ type: "varchar", length: 40 })
  nombre!: string;

  @Column({ type: "varchar", length: 40 })
  apellido!: string;

  @Column({ type: "varchar", length: 40 })
  direccion!: string;

  @Column({ type: "text" })
  email!: string;

  @Column({ type: "varchar", length: 150 })
  password!: string;
}
