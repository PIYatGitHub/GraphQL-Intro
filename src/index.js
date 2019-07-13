import {GraphQLServer} from 'graphql-yoga'
import  uuidv4 from 'uuid/v4'
import db from './db'

//API Resolvers
const resolvers = {
  Query:{
    me (parent, args, {db}, info){
      return db.user_seed[0]
    },
    post (parent, args, {db}, info){
      return db.posts_seed[0]
    },
    users(parent, args, {db}, info){
      if (args.query) return db.user_seed.filter((user)=> user.name.toLowerCase().includes(args.query.toLowerCase()));
      return db.user_seed
    },
    posts(parent, args, {db}, info){
      if (args.query) return db.posts_seed.filter((post)=> post.title.toLowerCase().includes(args.query.toLowerCase()) ||
        post.body.toLowerCase().includes(args.query.toLowerCase()));
      return db.posts_seed
    },
    comments(parent, args, {db}, info){
      return db.comments_seed
    }
  },
  Post: {
    author(parent, args, {db}, info){
      return db.user_seed.find((u)=>u.id === parent.author)
    },
    comments(parent, args, {db}, info){
      return db.comments_seed.filter((c)=>c.post === parent.id)
    }
  },
  User: {
    posts(parent, args, {db}, info){
      return db.posts_seed.filter((p)=>p.author === parent.id)
    },
    comments(parent, args, {db}, info){
      return db.comments_seed.filter((c)=>c.author === parent.id)
    }
  },
  Comment: {
    author(parent, args, {db}, info){
      return db.user_seed.find((u)=>u.id === parent.author)
    },
    post(parent, args, {db}, info){
      return db.posts_seed.find((p)=>p.id === parent.post)
    }
  },
  Mutation: {
    createUser(parent, args, {db}, info){
      const emailTaken = db.user_seed.some((u)=>u.email === args.data.email);
      if (emailTaken) throw new Error("The email is already taken");
      const user = {
        id: uuidv4(),
        ...args.data
      };
      db.user_seed.push(user);
      return user;
    },
    deleteUser(parent, args, {db}, info){
     const userInex = db.user_seed.findIndex((u)=>u.id === args.id);
     if (userInex === -1) throw new Error("User not found");
      db.posts_seed = db.posts_seed.filter((p)=>{
       const match = p.author === args.id;
       if (match) {
         db.comments_seed = db.comments_seed.filter((c)=>c.post !== p.id)
       }
       return !match
     });

      db.comments_seed = db.comments_seed.filter((c)=>c.author !== args.id);

     return db.user_seed.splice(userInex, 1)[0];
    },
    createPost(parent, args, {db}, info){
      const userExists = db.user_seed.some((u)=>u.id === args.data.author);
      if (!userExists) throw new Error("The user does not exist");
      const post = {
        id: uuidv4(),
        ...args.data
      };
      db.posts_seed.push(post);

      return post;
    },
    deletePost(parent, args, {db}, info){
      const postInex = db.posts_seed.findIndex((p)=>p.id === args.id);
      if (postInex === -1) throw new Error("Post not found");
      db.comments_seed = db.comments_seed.filter((c)=>c.post !== args.id);

      return db.posts_seed.splice(postInex, 1)[0];
    },
    createComment(parent, args, {db}, info){
      const userExists = db.user_seed.some((u)=>u.id === args.data.author),
            postExists = db.posts_seed.some((p)=>p.id === args.data.post && p.published);
      if (!userExists) throw new Error("The user does not exist");
      if (!postExists) throw new Error("The post does not exist");
      const comment = {
        id: uuidv4(),
        ...args.data
      };
      db.comments_seed.push(comment);

      return comment;
    },
    deleteComment(parent, args, {db}, info){
      const cmtInex = db.comments_seed.findIndex((c)=>c.id === args.id);
      if (cmtInex === -1) throw new Error("Comment not found");

      return db.comments_seed.splice(cmtInex, 1)[0];
    },
  }
};

const server = new GraphQLServer({
  typeDefs:'./src/schema.graphql',
  resolvers,
  context: {
    db
  }
});

server.start(()=>console.log('the server is up'));