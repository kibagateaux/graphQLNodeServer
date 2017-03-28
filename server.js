import GraphHTTP from 'express-graphql';
import Express from 'express';

import schema from './graphql';

const app = Express();

app.use('/graphql', GraphHTTP({
  schema: schema,
  // pretty: true,
  graphiql: true
}))

app.listen(8080, () => {
   console.log("App listening on port 8080");
});
