import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsBoolean, IsString, IsArray } from "class-validator";

export class AdminDto {
    @ApiProperty({
      description: '해당하는 데이터들을 가져오기 위한 관리구분',
      example: "고구마"
    })
    @IsNotEmpty()
    @IsString()
    readonly 관리구분: string;

    @ApiProperty({
      description: '해당하는 데이터들을 가져오기 위한 품목',
      example: "일반고구마"
    })
    @IsNotEmpty()
    @IsString()
    readonly 품목: string;

    @ApiProperty({
      description: '해당하는 데이터들을 가져오기 위한 품종',
      example: "하루까"
    })
    @IsNotEmpty()
    @IsString()
    readonly 품종: string;
}
export class OptionFieldDto{
  @ApiProperty({
    description: '옵션으로 제공되는 관리구분 요소 배열',
    example: ["고구마","수입과일","자재"]
  })
  @IsNotEmpty()
  @IsArray()
  readonly 관리구분: [];

  @ApiProperty({
    description: '옵션으로 제공되는 품목 배열',
    example: ["일반고구마","자색고구마","레몬","용기"]
  })
  @IsNotEmpty()
  @IsArray()
  readonly 품목: [];

  @ApiProperty({
    description: '옵션으로 제공되는 품종 배열',
    example: ["하루까","베니","세코야","삼성포장"]
  })
  @IsNotEmpty()
  @IsArray()
  readonly 품종: [];
}

export class ProductDetailDto {
  @ApiProperty({
    description: '요소를 구분짓기 위한 관리구분',
    example: "고구마"
  })
  @IsString()
  @IsNotEmpty()
  관리구분: string;

  @ApiProperty({
    description: '요소를 구분짓기 위한 품목',
    example: "일반고구마"
  })
  @IsString()
  @IsNotEmpty()
  품목: string;

  @ApiProperty({
    description: '요소를 구분짓기 위한 품종',
    example: "하루까"
  })
  @IsString()
  @IsNotEmpty()
  품종: string;

  @ApiProperty({
    description: '요소를 구분짓기 위한 등급',
    example: "대1"
  })
  @IsString()
  @IsNotEmpty()
  등급: string;

  @ApiProperty({
    description: '변경된 값',
    example: 800
  })
  @IsNumber()
  판매량: number;

  @ApiProperty({
    description: '변경된 값',
    example: 99
  })
  @IsNumber()
  비율: number;

  @ApiProperty({
    description: '변경된 알림설정 여부',
    example: 1
  })
  @IsBoolean()
  NotiSet: boolean;
}

export class NotiItemsDto {
  @IsString()
  @ApiProperty({ example: 'Tom', description: 'The name of the Cat' })
  관리구분: string;

  @IsString()
  @ApiProperty({ example: 'Tom', description: 'The name of the Cat' })
  품목: string;

  @IsString()
  @ApiProperty({ example: 'Tom', description: 'The name of the Cat' })
  품종: string;

  @IsString()
  @ApiProperty({ example: 'Tom', description: 'The name of the Cat' })
  등급: string;

  @IsNumber()
  판매량: number;

  @IsNumber()
  비율: number;

  @IsBoolean()
  NotiSet: boolean;
}

