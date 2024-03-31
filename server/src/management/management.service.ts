import { Injectable } from '@nestjs/common';

@Injectable()
export class ManagementService {
  getStock(): string {
    return 'Stock status';
  }
  managementView(id: string, code: string): Promise<any> {
    const dataExample = id + code;
    console.log(dataExample);
    return;
  }
}
