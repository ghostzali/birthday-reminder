import { Repository } from "typeorm";
import { User } from "../entity/user.entity";
import moment from "moment-timezone";
import { GoogleMapsService } from "./google-maps.service";

export class UserService {
  private googleMapsService: GoogleMapsService;

  constructor(private respository: Repository<User>) {
    this.googleMapsService = new GoogleMapsService();
  }

  async create(user: {
    firstName: string;
    lastName: string;
    email: string;
    dob: string;
    address: string;
  }): Promise<User> {
    const address = await this.googleMapsService.getLocation(user.address);
    if (!address) throw new Error(`Address ${user.address} unknown`);

    const timezone = await this.googleMapsService.getTimezone(address.location);
    if (!timezone) throw new Error(`Location ${address.location} unknown`);

    const newUser = this.respository.create({
      ...user,
      dob: moment(user.dob).startOf("day").toDate(),
      address: address.address,
      location: address.location,
      timezone,
    });

    await this.respository.save(newUser);

    return newUser;
  }

  async delete(id: number): Promise<boolean> {
    const deleted = await this.respository.delete(id);

    return deleted.affected ? deleted.affected > 0 : false;
  }

  async getById(id: number): Promise<User | null> {
    return this.respository.findOneBy({ id });
  }

  async getAll(): Promise<User[]> {
    return await this.respository.find();
  }

  async birthdayMessageSent(id: number): Promise<void> {
    await this.respository.update(id, {
      lastBirthdayMessageSentAt: moment().toDate(),
    });
  }
}
