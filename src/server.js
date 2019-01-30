import { ApolloServer } from 'apollo-server'
import { loadTypeSchema } from './utils/schema'
import { merge } from 'lodash'
import config from './config'
import { connect } from './db'
import product from './types/product/product.resolvers'
import coupon from './types/coupon/coupon.resolvers'
import user from './types/user/user.resolvers'

const types = ['product', 'coupon', 'user']

const users = [
  {
    email: "kyle.fidalgo@example.com",
    password: "as9d876a8sd76876876",
    name: "Kyle Fidalgo",
    id: '123681768726873123'
  },{
    email: "amy.fidalgo@example.com",
    password: "as9d876a8sd76876876",
    name: "Amy Fidalgo",
    id: '123681768726873124'
  }
]

export const start = async () => {
  const rootSchema = `
    type Cat {
      name: String!
    }

    type User {
      id: ID!
      email: String!
      password: String!
      name: String!
    }

    type Query {
      myCat: Cat
      user: [User]!
    }

    type Mutation {
      newCat(input: CatInput!): Cat!
    }

    input CatInput{

      name: String!
    }
    schema {
      query: Query
      mutation: Mutation
    }
  `
  const schemaTypes = await Promise.all(types.map(loadTypeSchema))

  const server = new ApolloServer({
    typeDefs: [rootSchema],
    resolvers: {
      Query: {
        myCat(){
      return {name: 'Garfield'}
    },
    user(){
      return users;
    }
  },
    Mutation: {
      newCat(parent, {input}, context, info){

        return {
          name: input.name,
        }

      }
    }},
    context({ req }) {
      // use the authenticate function from utils to auth req, its Async!
      return { user: null }
    }
  })

  await connect(config.dbUrl)
  const { url } = await server.listen({ port: config.port })

  console.log(`GQL server ready at ${url}`)
}
