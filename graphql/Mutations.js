import { InfluencerType, UserType, VideoType } from './ModelTypes';
import db from '../db';

import { mutationWithClientMutationId, fromGlobalId } from 'graphql-relay';
import { GraphQLNonNull} from 'graphql';

 console.log("Mutations JS UserType");
  console.log(UserType);

const CreateNewUserMutation = mutationWithClientMutationId({
  name: 'CreateNewUserMutation',
  inputFields: {
    user: { type: new GraphQLNonNull(UserType) },
  },
  outputFields: {
    user: {
      type: UserType,
      resolve: user => db.models.user.findById(id),
    },
  },
  mutateAndGetPayload: ({id}) => {
    const user = fromGlobalId(id).id;
    return { user };
  },
});

export default { CreateNewUserMutation };
