module.exports.loadModules = (modules) => {
  let queries = '';
  let mutations = '';
  let names = [];
  let schemas = [];
  let resolvers = {
    Query: {},
    Mutation: {}
  };

  modules && modules.length && modules.forEach(module => {

    module.resolvers && Object.assign(resolvers, module.resolvers);
    module.queries && Object.assign(resolvers.Query, module.queries);
    module.mutations && Object.assign(resolvers.Mutation, module.mutations);
    queries += module.queryText ? module.queryText : '';
    mutations += module.mutationsText ? module.mutationsText : '';
    module.name && names.push(module.name);
    module.schema && schemas.push(module.schema);

  });

  names = names.join(' | ');
  const schemaResult = `
    type Query {
      ${queries}
    }

    type Mutation {
      ${mutations}
    }

    union SearchResult = ${names}

    schema {
      query: Query
      mutation: Mutation
    }
  `
  let typeDefs = [schemas].concat([schemaResult]).join(' ');

  return { resolvers, typeDefs };
}
