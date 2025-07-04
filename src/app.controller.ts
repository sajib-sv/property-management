import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('app')
@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: 'Welcome route for Property Management API' })
  getWelcome(): {
    message: string;
    docs: string;
    author: string;
    timestamp: string;
  } {
    return {
      message: '👋 Welcome to the Property Management API!',
      docs: 'Visit /docs for Swagger API documentation.',
      author: 'https://github.com/shahadathhs',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  getHealth(): { status: string; timestamp: string } {
    console.info(`[HEALTH] Ping received at ${new Date().toISOString()}`);
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
