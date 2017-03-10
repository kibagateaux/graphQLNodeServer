const { GraphQLObjectType } = require('graphql');

const SingleUserQuery = new GraphQLObjectType({
  name: 'SingleUserQuery',
  fields: () => ({
    viewer: {
      type: User,
      resolve(parent, args, ownProps) {
        return {
          id: '123',
          name: 'Kiba'
        }
      }
    }
  })
});
exports.SingleUserQuery = SingleUserQuery;
