import {
  graphql,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLID
} from 'graphql';

export default new GraphQLObjectType({
  name: 'User',
  fields: {
    _id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    username: {
      type: GraphQLString
    },
    created_at:{
      type:
    }
    age: {
      type:
    },
    biography: {
      type: GraphQLString
    }
  }
});
