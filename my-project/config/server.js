
module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: env('PUBLIC_URL', 'http://localhost:1337'),
  proxy: true,
  secure:false,
  app: {
    keys: env.array("APP_KEYS", ["testKey1", "testKey2"]),
  },
});
