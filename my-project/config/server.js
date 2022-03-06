module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  // url: env('','https://688a-2a02-a45a-46af-1-5c5c-bbef-7bd0-926b.ngrok.io'),
  url: env('PUBLIC_URL','http://localhost:1337'),
  app: {
    keys: env.array("APP_KEYS", ["testKey1", "testKey2"]),
  },
});
