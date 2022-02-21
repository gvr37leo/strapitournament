module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '84ba9980c54ba86b6cdb3775cd9d64b6'),
  },
});
