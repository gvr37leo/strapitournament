'use strict';

/**
 *  tournament controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::tournament.tournament',({strapi}) => ({
  async signup(ctx){
    ctx.request.body//https://koajs.com/#request
    ctx.response//https://koajs.com/#response
    ctx.body = 'hello signup'
    tournamentid
    memberid

    // var res = await strapi.entityService.findOne('api::tournament.tournament',1,{
    //   fields: ['*'],
    //   populate:'signups',
    // })

    var res = await strapi.entityService.findOne('api::user.user',1,{
      fields: ['*'],
      populate:'signups',
    })
    var signups = res.data.signups

    if(signups.find(s => s.tournament.id == tournamentid)){
      return 'already signed up'
    }

    if(Date.now() >= tournament.startsAt){
      return 'tournament already started'
    }

    var res = await strapi.entityService.create('api::tournament-signup.tournament-signup',{
      data:{
        player:1,
        tournament:1,
        checkedIn:false,
      }
    })

    //     var tournament = UmbracoContext.Content.GetById(tournamentid) as Tournament;
//     var signups = tournament.Descendants<TournamentSignup>();
//     var member = Services.MemberService.GetByKey(new Guid(memberguid));
//     if(signups.Any(s => s.Player?.Key == member?.Key)) {
//         return BadRequest("already signed up");
//     }
//     if(DateTime.Now >= tournament.StartsAt) {
//         return BadRequest("tournament already started");
//     }
//     //check tournament startsat
//     //check if user already signedup
//     //optional check tournament state

//     //if all is well
//     var tournamentsignupsnode = tournament.FirstChild<TournamentSignups>();
//     if(tournamentsignupsnode == null) {
//         var signupscontent = Services.ContentService.Create("signups",tournament.Key,TournamentSignups.ModelTypeAlias);
//         Services.ContentService.SaveAndPublish(signupscontent);
//         tournamentsignupsnode = UmbracoContext.Content.GetById(signupscontent.Id) as TournamentSignups;
//     }

//     var signupcontent = Services.ContentService.Create(member.Name,tournamentsignupsnode.Key, TournamentSignup.ModelTypeAlias);
//     //signupcontent.SetValue("tournament",new GuidUdi("document",tournament.Key));
//     signupcontent.SetValue("player", new GuidUdi("member", new Guid(memberguid)));
//     Services.ContentService.SaveAndPublish(signupcontent);
//     //Ok("sign up succesfull");
//     //Caching.refresh($"signedupplayers:{tournament.Id}");
//     return RedirectToCurrentUmbracoPage();












  },

  async checkin(ctx){
    ctx.body = 'hello checkin'
  },

  async generatebracket(ctx){
    ctx.request

    //'api::match.match'
    //'api::tournament-signup.tournament-signup'
    //'api::tournament.tournament'
    // https://docs.strapi.io/developer-docs/latest/developer-resources/database-apis-reference/entity-service/crud.html
    // var res = await strapi.entityService.findOne('api::match.match',1,{
    //   fields: ['*'],
    //   populate:'*',
    // })

    // var res = await strapi.entityService.create('api::match.match',{
    //   data:{
    //     score1:1,
    //     score2:2,
    //     scoreReported:true,
    //     depth:7,
    //     player1:1,
    //     player2:2,
    //     tournament:1,
    //     parentmatch:null,
    //   }
    // })

    // var res = await strapi.entityService.delete('api::match.match',8)

    var res = await strapi.entityService.update('api::match.match',7,{
      data:{
        score1:9,
        score2:99,
        scoreReported:false,
        depth:99,
      }
    })

    // strapi.query('match').create()
    // strapi.query('tournament').create()
    // strapi.query('tournament-signup').create()
    // strapi.service('api::match.match').create(create)
    // strapi.service('api::match.match').update(create)
    // strapi.service('api::match.match').delete(create)
    // strapi.service('api::match.match').find(create)

    ctx.body = res
  },

  async index(ctx, next) { // called by GET /hello
    ctx.body = 'Hello World!'; // we could also send a JSON
  },
}));
