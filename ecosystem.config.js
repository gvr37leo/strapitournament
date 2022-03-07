module.exports = {
  apps: [
    // {
    //   name: 'strapi',
    //   cwd: '/strapitournament/my-project',
    //   script: 'npm',
    //   args: 'run develop',
    //   // env: {
    //   //   NODE_ENV: 'production',
    //   //   DATABASE_HOST: 'localhost', // database endpoint
    //   //   DATABASE_PORT: '5432',
    //   //   DATABASE_NAME: 'strapi', // DB name
    //   //   DATABASE_USERNAME: 'your-name', // your username for psql
    //   //   DATABASE_PASSWORD: 'password', // your password for psql
    //   // },
    // },
    {
      name: 'frontend',
      cwd: '/strapitournament/frontend',
      script: './frontend/npm',
      args: 'run start',
    },
    // {
    //   name: 'webhook',
    //   cwd: '/strapitournament',
    //   script: 'webhook.js'
    // },
  ],
};
 