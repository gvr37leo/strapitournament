// https://stackoverflow.com/questions/58145392/debugging-strapi-in-visual-studio-code
// node --inspect server.js

const strapi = require('@strapi/strapi');
strapi({ dir: process.cwd(), autoReload: true }).start();
