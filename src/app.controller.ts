import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('app')
@Controller()
export class AppController {
  @Get()
  getWelcome() {
    return {
      message: '👋 Welcome to the Property Management API!',
      docs: 'Visit /docs for Swagger API documentation.',
      author: 'https://github.com/shahadathhs',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('health')
  getHealth(): { status: string; timestamp: string } {
    console.info(`[HEALTH] Ping received at ${new Date().toISOString()}`);
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
