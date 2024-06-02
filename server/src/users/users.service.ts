import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  create(id: string, password: string): Promise<User> {
    const user = new User();
    user.id = id;
    user.password = password;

    return this.usersRepository.save(user);
  }
  findOne(id: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }
  async register(id: string, password: string): Promise<User> {
    const user = new User();
    user.id = id;
    user.password = password;
    return this.usersRepository.save(user);
  }
}
