module.exports.schema = `
  scalar Date
  type Event {
    id: ID!
    title: String!
    dateStart: Date!
    dateEnd: Date!
    users: [User]
    room: Room
  }
  input EventInput {
    title: String!
    dateStart: Date!
    dateEnd: Date!
  }
`;
