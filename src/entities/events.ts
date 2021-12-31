import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity("events")
export class Events {
    @PrimaryColumn()
    id: number;

    @Column("varchar")
    name: string;

    @Column("text")
    description: string;

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

    @Column("varchar", { nullable: true })
    themes: string;
}
