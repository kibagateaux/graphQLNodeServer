import { printSchema } from 'graphql';
import schema from './graphql';

const RelaySchema = printSchema(schema);
