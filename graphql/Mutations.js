import { mutationWithClientMutationId, fromGlobalId } from 'graphql-relay';

import { GraphQLNonNull, GraphQLString } from 'graphql';
import db, { User } from '../db';

import { InfluencerType, UserType, VideoType } from './ModelTypes';


const CreateNewUserMutation = mutationWithClientMutationId({
  name: 'CreateNewUserMutation',
  inputFields: {
    username: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: GraphQLString },
  },
  outputFields: {
    user: {
      type: InfluencerType,
      resolve: user => user,
    },
    name: {
      type: GraphQLString,
      resolve: ({name}) => name
    },
    email: {
      type: GraphQLString,
      resolve: ({email}) => email
    },
    username: {
      type: GraphQLString,
      resolve: ({username}) => username
    },
  },
  mutateAndGetPayload: (data) => {
    // data - params from mutation
    // so must use to create new user in database
    //how to give it an Influencer or User type?
    // in db there is no differentiaton
    // in GraphQL based on db column "is_influencer"
    const { name, username, email } = data
    const user  = User.create({
      name: name,
      username:username,
      email: email
    })._boundTo.dataValues

      // user.then(res => {
      //   let query = db.models.user.findById(res.id).then(res => res)
      //    console.log("promise query");
      //     console.log(query);
      // })

    return user ;
  },
});

export { CreateNewUserMutation };
