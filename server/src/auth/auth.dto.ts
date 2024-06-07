import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

// 공통 필드를 가지는 기본 클래스 생성
class BaseUserDto {
  @ApiProperty({
    description: '유저 아이디',
    example: "string"
  })
  @IsNotEmpty()
  @IsString()
  readonly id: string;

  @ApiProperty({
    description: '유저 비밀번호',
    example: "string"
  })
  @IsNotEmpty()
  @IsString()
  readonly password: string;
}

// SignUpDto에서 이메일 관련 필드 추가
export class SignUpDto extends BaseUserDto {
  @ApiProperty({
    description: '일반 회원가입 시 입력 이름',
    example: "Jung"
  })
  @IsOptional()
  @IsString()
  readonly name: string;

  @ApiProperty({
    description: '일반 회원가입 시 비밀번호 확인',
    example: "Same_Password"
  })
  @IsOptional()
  @IsString()
  readonly pwcheck: string;
}

// LoginDto는 BaseUserDto를 그대로 활용
export class LoginDto extends BaseUserDto {}


export class TokenDto extends BaseUserDto {
  @ApiProperty({
    description: '로그인 성공 시 토큰 반환',
    example: "ttookkeenn"
  })
  @IsOptional()
  @IsString()
  readonly token: string;
}

export class ValidCheckDto{
  @ApiProperty({
    description: '회원가입 시 아이디 중복 확인',
    example: "id"
  })
  @IsNotEmpty()
  @IsString()
  readonly id: string;
}