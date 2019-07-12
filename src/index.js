import {GraphQLServer} from 'graphql-yoga'

const user_seed = [
  {
    id: "99100101",
    name: "Pesho",
    email: "pesho@example.com"
  },
  {
    id: "100200300",
    name: "Yoyo",
    email: "yoyo@example.com"
  }
];

const posts_seed = [
  {
    id: "post112314",
    title: "New post",
    body: "sample post body...",
    published: false
  },
  {
    id: "post1352",
    title: "GraphQL - in details",
    body: "Graph Ql is suupa cool - use it...",
    published: true
  }
];

//Type definitions, e.g. the app schema
const typeDefs = `
  type Query {
   me: User!
   post: Post!
   users(query: String): [User!]!
   posts(query: String): [Post!]!
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
    me (parent, args, ctx, info){
      return user_seed[0]
    },
    post (parent, args, ctx, info){
      return posts_seed[0]
    },
    users(parent, args, ctx, info){
      if (args.query) return user_seed.filter((user)=> user.name.toLowerCase().includes(args.query.toLowerCase()));
      return user_seed
    },
    posts(parent, args, ctx, info){
      if (args.query) return posts_seed.filter((post)=> post.title.toLowerCase().includes(args.query.toLowerCase()) ||
        post.body.toLowerCase().includes(args.query.toLowerCase()));
      return posts_seed
    }
  }
};

const server = new GraphQLServer({
  typeDefs, resolvers
});

server.start(()=>console.log('the server is up!'));