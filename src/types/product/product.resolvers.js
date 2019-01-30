import { Product } from './product.model'
import { User, roles } from '../user/user.model'
import { AuthenticationError } from 'apollo-server'
import mongoose from 'mongoose'

const productsTypeMatcher = {
  GAMING_PC: 'GamingPc',
  BIKE: 'Bike',
  DRONE: 'Drone'
}

export default {
  Query: {
    async product(parent, {id}, ctx, info){
      const product = await Product.findById(id);
      return product;
    },
    async products(parent, args, ctx, info){
      return Product.find({}).exec();
    }
  },
  Mutation: {
    async newProduct(parent, args, ctx, info){
      const product = await Product.create({...args.input, createdBy: ctx.user._id});
      return product;
    },
    updateProduct(parent, {id, input}, ctx, info){
      // TODO: make sure person owns product or is an admin!
      return Product.findByIdAndUpdate(id, input, {
        new: true,
        runValidators: true,
      })
    },
    async removeProduct(parent, args, ctx, info){
      return Product.findByIdAndRemove({_id: args.id});
    }
  },
  Product: {
    // entire product comes in for parent arg
    __resolveType(product) {},
    async createdBy({createdBy}){
      console.log('in created by resolver')
      return User.findById(createdBy).exec();
    }
  },

}
