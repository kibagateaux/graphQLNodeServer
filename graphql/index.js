import {
  buildSchema,
} from 'graphql';



const apiSchema = buildSchema(`
  type Query{
    hello: String
    user(name: String!, id: Int): String
    login(email: String!, password: String!): String
  }
  `)

export default apiSchema;
