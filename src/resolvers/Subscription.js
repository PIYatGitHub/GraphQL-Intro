const Subscription = {
  comment: {
    subscribe(parent, {postID}, {db, pubsub}, info){
      const post = db.posts_seed.find((p)=> p.id === postID && p.published)
      if (!post) throw new Error('Post not found');

      return pubsub.asyncIterator(`comment ${postID}`)
    }
  }
};
export {Subscription as default}