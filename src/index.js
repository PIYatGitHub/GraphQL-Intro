import {GraphQLServer} from 'graphql-yoga'

const user_seed = [
  {
    id: "1",
    name: "Pesho",
    email: "pesho@example.com",
    age:27
  },
  {
    id: "2",
    name: "Yoyo",
    email: "yoyo@example.com"
  },
  {
    id: "3",
    name: "Gosh",
    email: "gosh@example.com",
    age: 33
  }
];

const posts_seed = [
  {
    id: "post112314",
    title: "New post",
    body: "sample post body...",
    published: false,
    author: '1'
  },
  {
    id: "post1352",
    title: "GraphQL - in details",
    body: "Graph Ql is suupa cool - use it...",
    published: true,
    author: '2'
  },
  {
    id: "post1",
    title: "Some awesome libraries for JS",
    body: "today we look at some pretty cool JS stuff...",
    published: true,
    author: '2'
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
    posts: [Post!]!
  }
  type Post {
    id: ID!
    author: User!
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
  },
  Post: {
    author(parent, args, ctx, info){
      return user_seed.find((u)=>u.id === parent.author)
    }
  }
};

const server = new GraphQLServer({
  typeDefs, resolvers
});

server.start(()=>console.log('the server is up!'));