'use strict';

/**
 *  tournament controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::tournament.tournament',({strapi}) => ({
  async signup(ctx){
    ctx.request.body//https://koajs.com/#request
    ctx.response//https://koajs.com/#response
  },

  async checkin(ctx){

  },

  async generateMatches(ctx){

  },
}));
