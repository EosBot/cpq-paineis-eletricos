import { Body, Controller, Get, Headers, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { createTenantContext } from '../tenancy/tenant-context';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { CustomerApproveQuoteDto } from './dto/customer-approve-quote.dto';
import { ReopenQuoteDto } from './dto/reopen-quote.dto';
import { SendQuoteDto } from './dto/send-quote.dto';
import { QuotesService } from './quotes.service';

@Controller('quotes')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Post()
  @Roles('admin', 'sales')
  create(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Body() dto: CreateQuoteDto,
  ) {
    return this.quotesService.createQuote(createTenantContext(tenantId, userId), dto);
  }

  @Get()
  @Roles('admin', 'engineer', 'sales')
  list(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
  ) {
    return this.quotesService.listQuotes(createTenantContext(tenantId, userId));
  }

  @Post(':quoteId/calculate')
  @Roles('admin', 'sales')
  calculate(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Param('quoteId') quoteId: string,
  ) {
    return this.quotesService.calculateQuoteVersion(
      createTenantContext(tenantId, userId),
      quoteId,
    );
  }

  @Post('send')
  @Roles('admin', 'sales')
  send(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Body() dto: SendQuoteDto,
  ) {
    return this.quotesService.sendQuote(createTenantContext(tenantId, userId), dto);
  }

  @Post('customer-approve')
  @Roles('admin', 'sales')
  customerApprove(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Body() dto: CustomerApproveQuoteDto,
  ) {
    return this.quotesService.customerApproveQuote(
      createTenantContext(tenantId, userId),
      dto,
    );
  }

  @Post('reopen')
  @Roles('admin')
  reopen(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Body() dto: ReopenQuoteDto,
  ) {
    return this.quotesService.reopenQuote(createTenantContext(tenantId, userId), dto);
  }
}
