import { mutationWithClientMutationId, fromGlobalId } from 'graphql-relay';

import { GraphQLNonNull, GraphQLInt } from 'graphql';
import db from '../db';

import { InfluencerType, UserType, VideoType } from './ModelTypes';


const CreateNewUserMutation = mutationWithClientMutationId({
  name: 'CreateNewUserMutation',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLInt) },
  },
  outputFields: {
    user: {
      type: new GraphQLNonNull(InfluencerType),
      resolve: user => db.models.user.findById(user.id),
    },
  },
  mutateAndGetPayload: ({id}) => {
    const user = fromGlobalId(id).id;
    return { user };
  },
});

export { CreateNewUserMutation };
