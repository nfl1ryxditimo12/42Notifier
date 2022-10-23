import { Repository } from "typeorm";
import { eventType } from "eventType";

abstract class IRepository<T> extends Repository<T> {
  public abstract findOne(): Promise<T>;
  public abstract createOne(event: eventType): Promise<void>;
  public abstract deleteOne(id: number): Promise<void>;
}

export default IRepository;
