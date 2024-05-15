import { Injectable, Inject } from '@nestjs/common';
// import { createCipheriv, randomBytes, scrypt, createDecipheriv } from 'crypto';
// import { promisify } from 'util';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from '../users/users.entity';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  //Hash algorithm with Salt and save the user information at the database
  async saveUserInformation(
    id: string,
    name: string,
    password: string,
  ): Promise<any> {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);
    const user = await this.userRepository
      .createQueryBuilder()
      .insert()
      .into(User)
      .values({ id: id, name: name, password: hash })
      .execute();
    return user;
  }

  //회원가입 시 동일 id가 존재하는지 확인하는 함수
  //check that target id is existing
  async idValidCheck(id: string): Promise<any> {
    //database table에서 해당 id가 존재하는지 확인
    const user = await this.userRepository
      .createQueryBuilder()
      .select('u.id') // id 필드만 선택
      .from(User, 'u')
      .where('u.id = :id', { id: id })
      .getOne();
    // user가 존재하면 true, 존재하지 않으면 false 반환
    if (user === null) {
      console.log(user);
      return false;
    } else {
      console.log(user);
      return true;
    }
  }

  async login(id: string, password: string): Promise<any> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .select('u.password')
      .from(User, 'u')
      .where('u.id = :id', { id: id })
      .getOne();
    if (user === null) return false;
    //const isMatch = await bcrypt.compareSync(password, user.password);
    const isMatch = bcrypt.compareSync(password, user.password);
    if (isMatch) {
      const payload = { id: id };
      // 클라이언트의 응답 헤더에 쿠키 설정
      //JWT TOKEN 생성 후 리턴
      const token = await this.jwtService.signAsync(payload);
      const returnRes = {
        id: id,
        token: token,
      };
      return returnRes;
    } else {
      return false;
    }
  }

  async logout(getToken: string): Promise<any> {
    const token = getToken;
    // 클라이언트의 응답 헤더에 쿠키 설정
    //JWT TOKEN 검사 후 리턴하는 로직 구현
    const payload = await this.jwtService.verifyAsync(token, {
      secret: jwtConstants.secret,
    });
    if (payload) {
      console.log('참값반환');
      return true;
    } else {
      console.log('거짓반환');
      return false;
    }
  }
}
