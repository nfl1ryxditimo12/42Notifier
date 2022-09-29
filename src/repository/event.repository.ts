import { EntityRepository, Repository } from "typeorm";
import { Events } from "@entities/events";
import { eventType } from "eventType";

@EntityRepository(Events)
export class EventRepo extends Repository<Events> {
  findOneEvent = () => {
    return this.createQueryBuilder("events").select().orderBy("events.id", "DESC").limit(1).getOne();
  };

  createEvent = async (event: eventType) => {
    const theme =
      event.themes.length > 0
        ? event.themes.map((value) => {
            return "# " + value.name;
          })
        : null;

    await this.createQueryBuilder("events")
      .insert()
      .into(Events)
      .values({
        id: event.id,
        name: event.name,
        description: event.description,
        location: event.location.length > 0 ? event.location : null,
        max_people: event.max_people !== null ? event.max_people : null,
        begin_at: event.begin_at,
        end_at: event.end_at,
        created_at: event.created_at,
        themes: theme !== null ? theme.join(", ") : null,
      })
      .execute();
  };

  deleteEvent = (id: number) => {
    this.createQueryBuilder("events").delete().where("events.id = :id", { id: id }).execute();
  };
}
