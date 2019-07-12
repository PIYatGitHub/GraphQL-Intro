import {GraphQLServer} from 'graphql-yoga'

//Type definitions, e.g. the app schema
const typeDefs = `
  type Query {
    id: ID!
    name: String!
    age: Int!
    employed: Boolean!
    salary: Float
  }
`;

//API Resolvers
const resolvers = {
  Query:{
    id(){
      return 'abc123'
    },
    name(){
      return 'Peter Iv. Yonkov'
    },
    age(){
      return 27
    },
    employed(){
      return false
    },
    salary(){
      return null
    }
  }
};

const server = new GraphQLServer({
  typeDefs, resolvers
});

server.start(()=>{
  console.log('the server is up!');
});