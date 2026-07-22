import { Body, Controller, Get, Post, Req } from '@nestjs/common';

@Controller('test')
export class TestController {
  @Post('echo')
  echo(@Body() body: any, @Req() req: any) {
    return {
      body,
      headers: req.headers,
      rawBody: req.rawBody?.toString(),
      method: req.method,
      url: req.url,
    };
  }

  @Get('health')
  health() {
    return { status: 'ok' };
  }
}
