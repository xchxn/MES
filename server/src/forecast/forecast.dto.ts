import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsBoolean, IsString, IsArray } from "class-validator";

export class ForecastDto {
    @ApiProperty({
      description: '해당하는 데이터들을 가져오기 위한 관리구분',
      example: "string"
    })
    @IsNotEmpty()
    @IsString()
    readonly 관리구분: string;

    @ApiProperty({
      description: '해당하는 데이터들을 가져오기 위한 품목',
      example: "string"
    })
    @IsNotEmpty()
    @IsString()
    readonly 품목: string;

    @ApiProperty({
      description: '해당하는 데이터들을 가져오기 위한 품종',
      example: "string"
    })
    @IsNotEmpty()
    @IsString()
    readonly 품종: string;
}

export class GetOptionsDto {
  @ApiProperty({
    description: '해당하는 데이터들을 가져오기 위한 관리구분',
    example: "고구마"
  })
  @IsString()
  @IsOptional()
  관리구분: string;

  @ApiProperty({
    description: '해당하는 데이터들을 가져오기 위한 품목',
    example: "일반고구마"
  })
  @IsString()
  @IsOptional()
  품목: string;

  @ApiProperty({
    description: '해당하는 데이터들을 가져오기 위한 품종',
    example: "하루까"
  })
  @IsString()
  @IsOptional()
  품종: string;

  @ApiProperty({
    description: '해당하는 데이터들을 가져오기 위한 등급',
    example: "상1"
  })
  @IsString()
  @IsOptional()
  등급: string;
}

export class SelectedOptionsDto extends GetOptionsDto{}

export class AnomalyReturnDto {
  @ApiProperty({
    description: '이상값 반환 관리구분',
    example: "고구마"
  })
  @IsString()
  관리구분: string;

  @ApiProperty({
    description: '이상값 반환 품목',
    example: "일반고구마"
  })
  @IsString()
  품목: string;

  @ApiProperty({
    description: '이상값 반환 품종',
    example: "하루까"
  })
  @IsString()
  품종: string;

  @ApiProperty({
    description: '이상값 반환 등급',
    example: "대1"
  })
  @IsString()
  등급: string;

  @ApiProperty({
    description: '이상값 반환 예측재고',
    example: 800
  })
  @IsNumber()
  예측재고: number;

  @ApiProperty({
    description: '이상값 반환 예측중량',
    example: 99
  })
  @IsNumber()
  예측중량: number;

  @ApiProperty({
    description: '이상값 반환 예측날짜',
    example: "YYYY-MM-DD"
  })
  @IsString()
  예측날짜: string;

  @ApiProperty({
    description: '이상값 반환 재고상태',
    example: "O"
  })
  @IsString()
  재고상태: string;

  @ApiProperty({
    description: '이상값 반환 중량상태',
    example: "X"
  })
  @IsString()
  중량상태: string;
}

export class GetTargetDataDto extends AnomalyReturnDto{}