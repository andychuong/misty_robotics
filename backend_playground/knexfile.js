// Define DB connections for different environments
module.exports = {
  development: {
    client: "pg",
    connection: "postgres://localhost/mistydb-dev"
  },
  test: {},
  production: {
    client: "pg",
    connection: process.env.DATABASE_URL
  }
};
