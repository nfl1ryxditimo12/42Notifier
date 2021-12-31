import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity("exams")
export class Exams {
    @PrimaryColumn()
    id: number;

    @Column("varchar")
    name: string;

    @Column("varchar", { nullable: true })
    location: string;

    @Column("int", { nullable: true })
    max_people: number;

    @Column("datetime")
    begin_at: Date;

    @Column("datetime")
    end_at: Date;

    @Column("datetime")
    created_at: Date;
}
