import { Module } from '@nestjs/common';
import { DiscountController } from '../../presentation/controller/discount.controller';
import { GetDiscountService } from '../../application/service/discounts.service';
import { SeederModule } from './seeder.module';
import { UserSchema, ProductSchema } from '../schema/user.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: 'User', schema: UserSchema },
        { name: 'Product', schema: ProductSchema }
      ]), 
    SeederModule],
  controllers: [ DiscountController ],
  providers: [ GetDiscountService ]
})
export class DiscountModule { }