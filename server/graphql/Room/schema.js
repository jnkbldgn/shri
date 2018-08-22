module.exports.schema = `
  type Room {
    id: ID!
    title: String!
    capacity: Int!
    floor: Int!
  }
  input RoomInput {
    title: String!
    capacity: Int!
    floor: Int!
  }
`;
