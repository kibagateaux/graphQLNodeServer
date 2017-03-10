const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLID
} = require('graphql');

export default new GraphQLObjectType({
  name: 'User',
  fields: {
    _id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    name: {
      type: new GraphQLNonNull(GraphQLString)
    },
    age: {
      type:
    },
    biography: {
      type: GraphQLString
    }
  }
});
