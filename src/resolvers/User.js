const User = {
  posts(parent, args, {db}, info){
    return db.posts_seed.filter((p)=>p.author === parent.id)
  },
  comments(parent, args, {db}, info){
    return db.comments_seed.filter((c)=>c.author === parent.id)
  }
};

export {User as default}