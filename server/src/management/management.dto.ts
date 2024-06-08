import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsArray } from 'class-validator';

export class GetOptionsDto {
  @ApiProperty({
    description: '해당하는 데이터들을 가져오기 위한 관리구분',
    example: '고구마',
  })
  @IsString()
  @IsOptional()
  관리구분: string;

  @ApiProperty({
    description: '해당하는 데이터들을 가져오기 위한 품목',
    example: '일반고구마',
  })
  @IsString()
  @IsOptional()
  품목: string;

  @ApiProperty({
    description: '해당하는 데이터들을 가져오기 위한 품종',
    example: '하루까',
  })
  @IsString()
  @IsOptional()
  품종: string;

  @ApiProperty({
    description: '해당하는 데이터들을 가져오기 위한 등급',
    example: '상1',
  })
  @IsString()
  @IsOptional()
  등급: string;
}

export class GetDateOptionsDto {
  @ApiProperty({
    description: '데이터가 존재하는 날짜 배열 반환',
    example: ['2000-01-01', '2000-01-02'],
  })
  @IsArray()
  @IsOptional()
  날짜: [];
}

export class TargetDateOptionsDto {
  @ApiProperty({
    description: '날짜에 해당하는 데이터 반환',
    example: '2000-01-01',
  })
  @IsArray()
  @IsOptional()
  날짜: string;
}

export class TargetDateItemsReturnDto {
  @ApiProperty({
    description: '데이터 반환 - 관리구분',
    example: '고구마',
  })
  @IsString()
  관리구분: string;

  @ApiProperty({
    description: '데이터 반환 - 품목',
    example: '일반고구마',
  })
  @IsString()
  품목: string;

  @ApiProperty({
    description: '데이터 반환 - 품종',
    example: '하루까',
  })
  @IsString()
  품종: string;

  @ApiProperty({
    description: '데이터 반환 - 등급',
    example: '대1',
  })
  @IsString()
  등급: string;

  @ApiProperty({
    description: '데이터 반환 - 예측재고',
    example: 800,
  })
  @IsNumber()
  전월재고: number;

  @ApiProperty({
    description: '데이터 반환 - 예측중량',
    example: 99,
  })
  @IsNumber()
  전월중량: number;

  @ApiProperty({
    description: '데이터 반환 - 예측날짜',
    example: 1234,
  })
  @IsNumber()
  입고수량: number;

  @ApiProperty({
    description: '데이터 반환 - 재고상태',
    example: 1234,
  })
  @IsNumber()
  입고중량: number;

  @ApiProperty({
    description: '데이터 반환 - 중량상태',
    example: 1234,
  })
  @IsNumber()
  출고수량: number;

  @ApiProperty({
    description: '데이터 반환 - 예측중량',
    example: 99,
  })
  @IsNumber()
  출고중량: number;

  @ApiProperty({
    description: '데이터 반환 - 예측중량',
    example: 99,
  })
  @IsNumber()
  현재고: number;

  @ApiProperty({
    description: '데이터 반환 - 예측중량',
    example: 99,
  })
  @IsNumber()
  현재중량: number;

  @ApiProperty({
    description: '데이터 반환 - 예측중량',
    example: 'YYYY-MM-DD',
  })
  @IsString()
  날짜: string;
}

export class GetItemsDto {
  @ApiProperty({
    description: '데이터의 현재고',
    example: '고구마',
  })
  @IsNumber()
  @IsOptional()
  현재고: number;

  @ApiProperty({
    description: '데이터의 현재중량',
    example: 12345,
  })
  @IsNumber()
  @IsOptional()
  현재중량: number;

  @ApiProperty({
    description: '데이터의 날짜',
    example: 'YYYY-MM-DD',
  })
  @IsString()
  @IsOptional()
  날짜: string;
}
