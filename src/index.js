import {GraphQLServer} from 'graphql-yoga'
import {user_seed, comments_seed, posts_seed} from './seed_data'

//Type definitions, e.g. the app schema
const typeDefs = `
  type Query {
   me: User!
   post: Post!
   users(query: String): [User!]!
   posts(query: String): [Post!]!
   comments: [Comment!]!
  }
  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment!]!
  }
  type Post {
    id: ID!
    author: User!
    title: String!
    body: String!
    published: Boolean!
    comments: [Comment!]!
  }
  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post! 
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
    },
    comments(parent, args, ctx, info){
      return comments_seed
    }
  },
  Post: {
    author(parent, args, ctx, info){
      return user_seed.find((u)=>u.id === parent.author)
    },
    comments(parent, args, ctx, info){
      return comments_seed.filter((c)=>c.post === parent.id)
    }
  },
  User: {
    posts(parent, args, ctx, info){
      return posts_seed.filter((p)=>p.author === parent.id)
    },
    comments(parent, args, ctx, info){
      return comments_seed.filter((c)=>c.author === parent.id)
    }
  },
  Comment: {
    author(parent, args, ctx, info){
      return user_seed.find((u)=>u.id === parent.author)
    },
    post(parent, args, ctx, info){
      return posts_seed.find((p)=>p.id === parent.post)
    }
  },
};

const server = new GraphQLServer({
  typeDefs, resolvers
});

server.start(()=>console.log('the server is up!'));