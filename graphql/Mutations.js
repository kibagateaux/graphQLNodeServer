import { mutationWithClientMutationId, fromGlobalId } from 'graphql-relay';

import { GraphQLNonNull, GraphQLString } from 'graphql';
import { User } from '../db';

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
    username: {
      type: GraphQLString ,
      resolve: user => { console.log(user.instance); return user.username}
    }
  },
  mutateAndGetPayload: (data) => {
    // data - params from mutation
    // so must use to create new user in database
    //how to give it an Influencer or User type?
    // in db there is no differentiaton
    // in GraphQL based on db column "is_influencer"
    console.log("CreateNewUserMutation mutateAndGetPayload");
    console.log(data);
    const { name, username, email } = data
    const user = User.create({
      name: name,
      username:username,
      email: email
    }).then(res => res);

    return { user };
  },
});

export { CreateNewUserMutation };
