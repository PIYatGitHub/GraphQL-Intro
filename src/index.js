import {GraphQLServer} from 'graphql-yoga'
// import {user_seed, comments_seed, posts_seed} from './seed_data'
import  uuidv4 from 'uuid/v4'


let user_seed = [
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

let posts_seed = [
  {
    id: "10",
    title: "New post",
    body: "sample post body...",
    published: false,
    author: '1'
  },
  {
    id: "11",
    title: "GraphQL - in details",
    body: "Graph Ql is suupa cool - use it...",
    published: true,
    author: '2'
  },
  {
    id: "12",
    title: "Some awesome libraries for JS",
    body: "today we look at some pretty cool JS stuff...",
    published: true,
    author: '2'
  }
];

let comments_seed = [
  {
    id: "1",
    text: "blah",
    author: "1",
    post: "10"
  },
  {
    id: "2",
    text: "pewdie pie",
    author: "1",
    post: "10"
  },
  {
    id: "3",
    text: "king kong...",
    author: "3",
    post: "11"
  },
  {
    id: "4",
    text: "A deep comment...",
    author: "3",
    post: "12"
  }
];

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
    createUser(data: CreateUserInput): User!
    deleteUser(id: ID!): User!
    createPost(data: CreatePostInput): Post!
    deletePost(data: CreatePostInput): Post!
    createComment(data: CreateCommentInput): Comment!
    deleteComment(data: CreateCommentInput): Comment!
  }
  
  input CreateUserInput {
    name: String!
    email: String!
    age: Int
  } 
  
  input CreatePostInput {
    title: String!
    body: String!
    published: Boolean!
    author: ID!
  } 
  
  input CreateCommentInput {
   text: String!
   author: String!
   post: String!
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
      const emailTaken = user_seed.some((u)=>u.email === args.data.email);
      if (emailTaken) throw new Error("The email is already taken");
      const user = {
        id: uuidv4(),
        ...args.data
      };
      user_seed.push(user);
      return user;
    },
    deleteUser(parent, args, ctx, info){
     const userInex = user_seed.findIndex((u)=>u.id === args.id);
     if (userInex === -1) throw new Error("User not found");
     posts_seed = posts_seed.filter((p)=>{
       const match = p.author === args.id;
       if (match) {
         comments_seed = comments_seed.filter((c)=>c.post !== p.id)
       }
       return !match
     });

     comments_seed = comments_seed.filter((c)=>c.author !== args.id);

     return user_seed.splice(userInex, 1)[0];
    },
    createPost(parent, args, ctx, info){
      const userExists = user_seed.some((u)=>u.id === args.data.author);
      if (!userExists) throw new Error("The user does not exist");
      const post = {
        id: uuidv4(),
        ...args.data
      };
      posts_seed.push(post);
      return post;
    },
    createComment(parent, args, ctx, info){
      const userExists = user_seed.some((u)=>u.id === args.data.author),
            postExists = posts_seed.some((p)=>p.id === args.data.post && p.published);
      if (!userExists) throw new Error("The user does not exist");
      if (!postExists) throw new Error("The post does not exist");
      const comment = {
        id: uuidv4(),
        ...args.data
      };
      comments_seed.push(comment);
      return comment;
    }
  }
};

const server = new GraphQLServer({
  typeDefs, resolvers
});

server.start(()=>console.log('the server is up'));