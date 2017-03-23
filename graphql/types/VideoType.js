import {
  graphql,
  GraphQLSchema,
  GraphQLInterfaceType,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
  GraphQLBoolean,
} from 'graphql';

const VideoType = new GraphQLObjectType({
  name: "VideoType",
  description: "Videos for user viewing",
  fields: {
    id: { type: new GraphQLNonNull(GraphQLString)},
    author: {
      //needs to be type Influencer but impossible if defined in same file
      type: new GraphQLList(GraphQLInt),
      resolve: (parent, args) => {
         console.log("VideoType resolve");
          console.log(parent.id);
           console.log("___________________________");
           console.log(args);
       return db.any(
          "SELECT * FROM users WHERE id = $1", [parent.author]
        ).then(result => {
          console.log("VideoType resolve result");
          console.log(result)
          return result.map(x => x.id)
        })
      }
    }

  },
  resolve: ({db}, args) => {
    return db.any(
      "SELECT * FROM videos WHERE id = $1", [args.id]
    ).then(result => result)
  }
});

export { VideoType }
