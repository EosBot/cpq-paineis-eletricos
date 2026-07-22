import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { TenantContext } from '../tenancy/tenant-context.decorator';
import { type ITenantContext } from '../tenancy/tenant-context';
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
  create(@TenantContext() tenantContext: ITenantContext, @Body() dto: CreateQuoteDto) {
    return this.quotesService.createQuote(tenantContext, dto);
  }

  @Get()
  @Roles('admin', 'engineer', 'sales')
  list(@TenantContext() tenantContext: ITenantContext) {
    return this.quotesService.listQuotes(tenantContext);
  }

  @Post(':quoteId/calculate')
  @Roles('admin', 'sales')
  calculate(@TenantContext() tenantContext: ITenantContext, @Param('quoteId') quoteId: string) {
    return this.quotesService.calculateQuoteVersion(tenantContext, quoteId);
  }

  @Post('send')
  @Roles('admin', 'sales')
  send(@TenantContext() tenantContext: ITenantContext, @Body() dto: SendQuoteDto) {
    return this.quotesService.sendQuote(tenantContext, dto);
  }

  @Post('customer-approve')
  @Roles('admin', 'sales')
  customerApprove(
    @TenantContext() tenantContext: ITenantContext,
    @Body() dto: CustomerApproveQuoteDto,
  ) {
    return this.quotesService.customerApproveQuote(tenantContext, dto);
  }

  @Post('reopen')
  @Roles('admin')
  reopen(@TenantContext() tenantContext: ITenantContext, @Body() dto: ReopenQuoteDto) {
    return this.quotesService.reopenQuote(tenantContext, dto);
  }
}
