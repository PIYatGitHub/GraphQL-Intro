import {GraphQLServer} from 'graphql-yoga'

//Type definitions, e.g. the app schema
const typeDefs = `
  type Query {
   greeting(name: String): String!
   me: User!
   post: Post!
   grades: [Int!]!
   add (numbers: [Float!]!): Float!
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
    greeting (parent, args, ctx, info){
      if (args.name) return `Hello, ${args.name}!`;
      return `Hello!`
    },
    grades (parent, args, ctx, info){
      return [99, 25, 80, 73, 16, 100]
    },
    add (parent, args, ctx, info) {
      if (!args.numbers.length) return 0;
      return args.numbers.reduce((acc, currVal) =>acc + currVal);
    },
    me (parent, args, ctx, info){
      return {
        id: "123abv",
        name: "Pesho",
        email: "pesho@example.com"
      }
    },
    post (parent, args, ctx, info){
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

server.start(()=>console.log('the server is up!'));