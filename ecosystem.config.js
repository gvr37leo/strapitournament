module.exports = {
  apps: [
    {
      name: 'strapi',
      cwd: '/strapitournament/my-project',
      script: 'npm',
      args: 'run develop',
      env:{
        NODE_ENV: 'development',
        // NODE_ENV: 'production',
        // PUBLIC_URL: 'http://64.225.54.10:1337',
        PUBLIC_URL: 'http://157.245.119.170:1337',
        
      }
    },
    {
      name: 'frontend',
      cwd: '/strapitournament/frontend',
      script: 'npm',
      args: 'run start',
      env:{
        REACT_APP_ENVIRONMENT: 'production'
      }
    },
    {
      name: 'webhook',
      cwd: '/strapitournament',
      script: 'webhook.js'
    },
  ],
};
 