import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { User, Product } from 'src/domain/interface/user';
import { GetDiscountQuery } from 'src/application/query/getDiscountQuery';
import { Discount } from '../../domain/discount';
import GetDiscountResponse from '../response/getDiscountResponse';
import BirthdayDiscount from '../../domain/birthdayDiscount';
import BlackfridayDiscount from '../../domain/blackfridayDiscount';

@Injectable()
export class GetDiscountService {
  
  constructor(
    @Inject('USER_MODEL') private readonly userModel: Model<User>, 
    @Inject('PRODUCT_MODEL') private readonly productModel: Model<Product>) {
  }

  async get(query: GetDiscountQuery): Promise<GetDiscountResponse> {

    var discount = new Discount(0);

    const user = await this.userModel.findOne({id: query.getUserId()}).exec();

    if(this.isBirthday(user)) {
      console.log('User ' + user.get('id') + ' with birthday discount');
      const product = await this.productModel.findOne({ id: query.getProductId()}).exec();
      discount = new BirthdayDiscount(product.get('priceInCents'));
    }

    if(this.isBlackfriday()) {
      console.log('User ' + user.get('id') + ' with blackfriday discount');
      const product = await this.productModel.findOne({id: query.getProductId()});
      discount = new BlackfridayDiscount(product.get('priceInCents'));
    }

    return new GetDiscountResponse(discount);
  }

  private isBlackfriday(): Boolean {
    const today = new Date();
    return today.getDay() === 25 && today.getMonth() === 11;
  }

  private isBirthday(user: User): Boolean {
    const today = new Date();
    const birthday = new Date(user.get('dateOfBirth'));
    
    return today.getDay() === birthday.getDay() 
        && today.getMonth() === birthday.getMonth();
  }
}