const secret = "...>top secret message here<<<...",
      name = "Peter Iv. Yonkov",
      location = "Sofia";
const getGreeting = (name) => {
  return `Greetings, ${name}!`
}
export {secret, name, getGreeting, location as default}