const {
  graphql,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  graphqlSync,
} = require('graphql');

const axios = require('axios');

const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    users: {
      type: GraphQLList(UserType),
      async resolve(parentValue, args) {
        const { data } = await axios.get(
          `http://localhost:3000/companies/${parentValue.id}/users`
        );
        return data;
      },
    },
  }),
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: {
      type: CompanyType,
      async resolve(parentValue, args) {
        const { data } = await axios.get(
          `http://localhost:3000/companies/${parentValue.companyId}`
        );
        return data;
      },
    },
  },
});

const RootQueryType = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    users: {
      type: GraphQLList(UserType),
      async resolve(parentValue, args) {
        const { data } = await axios.get('http://localhost:3000/users');
        return data;
      },
    },
    companies: {
      type: GraphQLList(CompanyType),
      async resolve(parentValue, args) {
        const { data } = await axios.get('http://localhost:3000/companies');
        return data;
      },
    },
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      async resolve(parentValue, args) {
        const { data } = await axios.get(
          `http://localhost:3000/users/${args.id}`
        );
        return data;
      },
    },
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLString } },
      async resolve(parentValue, args) {
        const { data } = await axios.get(
          `http://localhost:3000/companies/${args.id}`
        );
        return data;
      },
    },
  },
});

const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      type: UserType,
      args: {
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        companyId: { type: GraphQLString },
      },
      async resolve(parentValue, { firstName, age, companyId }) {
        const { data } = await axios.post('http://localhost:3000/users', {
          firstName,
          age,
          companyId,
        });
        return data;
      },
    },
    deleteUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(parentValue, args) {
        const { data } = await axios.delete(
          `http://localhost:3000/users/${args.id}`
        );
        return data;
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQueryType,
  mutation: MutationType,
});
