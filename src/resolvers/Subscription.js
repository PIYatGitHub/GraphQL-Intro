const Subscription = {
  count: {
    subscribe(parent, args, {pubsub}, info){
      //will run whenever one tries to subscribe to sth...
      let count = 0;
      setInterval(()=>{
        count +=1;
        pubsub.publish('count', {
          count
        });
      },1000);

      return pubsub.asyncIterator('count')
    }
  }
};
export {Subscription as default}