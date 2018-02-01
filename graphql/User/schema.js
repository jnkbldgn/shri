module.exports.schema = `
  type User {
    id: ID!
    login: String!
    homeFloor: Int!
    avatarUrl: String!
  }
    input UserInput {
    login: String!
    homeFloor: Int!
    avatarUrl: String!
  }
`;
