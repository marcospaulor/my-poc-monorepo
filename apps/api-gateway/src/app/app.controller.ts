import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiResponse } from '@nestjs/swagger';
// import { getHealthHandler, HealthStatus } from '@my-poc-monorepo/domain';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  // @Get('health')
  // @ApiResponse({ status: 200, description: 'Health check' })
  // getHealth(): HealthStatus {
  //   return getHealthHandler();
  // }
}
