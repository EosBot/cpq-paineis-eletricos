import { forwardRef, Module } from '@nestjs/common';
import { FiscalModule } from './fiscal/fiscal.module';
import { FinancialModule } from './financial/financial.module';
import { InventoryModule } from './inventory/inventory.module';
import { SalesModule } from './sales/sales.module';
import { ProcurementModule } from './procurement/procurement.module';

@Module({
  imports: [
    FiscalModule,
    FinancialModule,
    InventoryModule,
    SalesModule,
    forwardRef(() => ProcurementModule),
  ],
  exports: [FiscalModule, FinancialModule, InventoryModule, SalesModule, ProcurementModule],
})
export class ErpModule {}
