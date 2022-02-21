'use strict';

/**
 * tournament-signup service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::tournament-signup.tournament-signup');
