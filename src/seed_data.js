//This file contains some dummy data to get you up and running before you get the db sorted
//out. Also you may want to use it for tests. Enjoy!
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

const comments_seed = [
  {
    id: "1",
    text: "blah"
  },
  {
    id: "2",
    text: "pewdie pie"
  },
  {
    id: "3",
    text: "king kong..."
  },
  {
    id: "4",
    text: "A deep comment..."
  }
];

export {user_seed, comments_seed, posts_seed}