module.exports = {
  apps: [
    {
      name: 'strapi',
      cwd: '/root/strapitournament/my-project',
      script: 'npm',
      args: 'run develop',
      env:{
        NODE_ENV: 'production',
        PUBLIC_URL: 'https://api.totaltavern.com',
      }
    },
    {
      name: 'frontend',
      cwd: '/root/strapitournament/frontend',
      script: 'npm',
      args: 'run start',
      env:{
        REACT_APP_ENVIRONMENT: 'production'
      }
    },
    {
      name: 'webhook',
      cwd: '/root/strapitournament',
      script: 'webhook.js'
    },
  ],
};
 