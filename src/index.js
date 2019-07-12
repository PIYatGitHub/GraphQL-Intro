import {GraphQLServer} from 'graphql-yoga'

//Type definitions, e.g. the app schema
const typeDefs = `
  type Query {
   me: User!
   post: Post!
  }
  type User {
    id: ID!
    name: String!
    email: String!
     age: Int
  }
  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
  }
`;

//API Resolvers
const resolvers = {
  Query:{
    me (){
      return {
        id: "123abv",
        name: "Pesho",
        email: "pesho@example.com"
      }
    },
    post (){
      return {
        id: "post112314",
        title: "New post",
        body: "sample post body...",
        published: false
      }
    }
  }
};

const server = new GraphQLServer({
  typeDefs, resolvers
});

server.start(()=>{
  console.log('the server is up!');
});