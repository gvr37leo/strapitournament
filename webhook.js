// https://docs.strapi.io/developer-docs/latest/setup-deployment-guides/deployment/hosting-guides/digitalocean.html
var secret = 'cucumber';
var repo = '/strapitournament';

const http = require('http');
const crypto = require('crypto');
const exec = require('child_process').exec;

const PM2_CMD = 'cd /strapitournament && pm2 startOrRestart ecosystem.config.js';

http
  .createServer(function(req, res) {
    req.on('data', function(chunk) {
      let sig =
        'sha1=' +
        crypto
          .createHmac('sha1', secret)
          .update(chunk.toString())
          .digest('hex');

      if (req.headers['x-hub-signature'] == sig) {
        exec(`cd ${repo} && git pull`, (error, stdout, stderr) => {// && ${PM2_CMD}
          if (error) {
            console.error(`exec error: ${error}`);
            return;
          }
          console.log(`stdout: ${stdout}`);
          console.log(`stderr: ${stderr}`);
        });
      }
    });

    res.end();
  })
  .listen(8080);
 //
  console.log('listening for pull requests on 8080') 