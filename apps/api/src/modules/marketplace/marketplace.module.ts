import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { MarketplaceOrderService } from './order.service';

@Module({
  controllers: [
    ProductController,
    CategoryController,
    CartController,
    CustomerController,
  ],
  providers: [
    ProductService,
    CategoryService,
    CartService,
    CustomerService,
    MarketplaceOrderService,
  ],
  exports: [ProductService, CartService, CustomerService, MarketplaceOrderService],
})
export class MarketplaceModule {}
