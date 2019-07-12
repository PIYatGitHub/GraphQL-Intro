import {GraphQLServer} from 'graphql-yoga'

//Type definitions, e.g. the app schema
const typeDefs = `
  type Query {
    hello: String!
    name: String!
    location: String!
    bio: String!
  }
`;

//API Resolvers
const resolvers = {
  Query:{
    hello(){
      return 'This is the response to hello!'
    },
    name(){
      return 'Peter Iv. Yonkov'
    },
    location(){
      return 'Sofia, Bulgaria'
    },
    bio(){
      return 'A non-robot dev, who is working very hard on new skills!'
    }
  }
};

const server = new GraphQLServer({
  typeDefs, resolvers
});

server.start(()=>{
  console.log('the server is up!');
});