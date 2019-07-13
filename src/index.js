import {GraphQLServer} from 'graphql-yoga'
import {user_seed, comments_seed, posts_seed} from './seed_data'
import  uuidv4 from 'uuid/v4'

//Type definitions, e.g. the app schema
const typeDefs = `
  type Query {
   me: User!
   post: Post!
   users(query: String): [User!]!
   posts(query: String): [Post!]!
   comments: [Comment!]!
  }
  
  type Mutation {
    createUser(name: String!, email: String!, age: Int): User!
    createPost(title: String!, body: String!, published: Boolean!, author: ID!): Post!
    createComment(text: String!, author: String!, post: String!): Comment!
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
  Mutation: {
    createUser(parent, args, ctx, info){
      const emailTaken = user_seed.some((u)=>u.email === args.email);
      if (emailTaken) throw new Error("The email is already taken!");
      const user = {
        id: uuidv4(),
        name: args.name,
        email: args.email,
        age: args.age
      };
      user_seed.push(user);
      return user;
    },
    createPost(parent, args, ctx, info){
      const userExists = user_seed.some((u)=>u.id === args.author);
      if (!userExists) throw new Error("The user does not exist!");
      const post = {
        id: uuidv4(),
        title: args.title,
        body: args.body,
        published: args.published,
        author: args.author
      };
      posts_seed.push(post);
      return post;
    },
    createComment(parent, args, ctx, info){
      const userExists = user_seed.some((u)=>u.id === args.author),
            postExists = posts_seed.some((p)=>p.id === args.post && p.published);
      if (!userExists) throw new Error("The user does not exist!");
      if (!postExists) throw new Error("The post does not exist!");
      const comment = {
        id: uuidv4(),
        text: args.text,
        author: args.author,
        post: args.post
      };
      comments_seed.push(comment);
      return comment;
    }
  }
};

const server = new GraphQLServer({
  typeDefs, resolvers
});

server.start(()=>console.log('the server is up!'));