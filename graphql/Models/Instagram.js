import fetch from 'node-fetch';

import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLList,
  GraphQLString,
  GraphQLInterfaceType,
  GraphQLNonNull,
  GraphQLEnumType,
} from 'graphql';

const InstagramType = new GraphQLObjectType({
  name: "InstagramType",
  description: "Instagram Social Media",
  fields: () => ({
    profile_img:    {
                      type: new GraphQLNonNull(GraphQLString),
                      resolve: (user) => user.profile_pic_url_hd
                    },
    external_url:   { type: GraphQLString },
    images:         {
                      type: new GraphQLList(ImageType),
                      resolve: (user) =>{
                        return user.data.user.media.nodes.map(x => ({
                          source_url: x.display_src,
                          likes:      x.likes.count,
                          caption:    x.caption,
                        }))
                      }
                    },
    bio:            {
                      type: GraphQLString,
                      resolve: ({biography}) => biography
                    },
    follower_count: {
                      type: new GraphQLNonNull(GraphQLInt),
                      resolve: ({followed_by}) => parseInt(followed_by.count)
                    },
    is_verified:    { type: new GraphQLNonNull(GraphQLBoolean) },
    username:       { type: new GraphQLNonNull(GraphQLString) }
  })
});

export { InstagramType };
