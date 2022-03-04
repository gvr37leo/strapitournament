var usersapi = 'plugin::users-permissions.user'
var signupapi = 'api::tournament-signup.tournament-signup'
var matchapi = 'api::match.match'
var tournamentapi = 'api::tournament.tournament'
var wpapi = 'api::webpage.webpage'

'use strict';

/**
 *  tournament controller
 */
//  https://docs.strapi.io/developer-docs/latest/development/backend-customization/requests-responses.html#requests
//https://koajs.com/#response
//https://koajs.com/#request
const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::tournament.tournament',({strapi}) => ({
  async signup(ctx){
    var tournamentid = ctx.request.body.tournamentid
    var memberid = ctx.request.body.memberid

    var user = await strapi.entityService.findOne('plugin::users-permissions.user',memberid,{
      fields: ['*'],
      populate:[
        'tournament_signups',
        'tournament_signups.tournament',
      ],
    })
    var tournament = await strapi.entityService.findOne(tournamentapi,tournamentid,{})


    if(user.tournament_signups.find(s => s.tournament.id == tournamentid)){
      ctx.response.status = 400
      ctx.response.body = 'already signed up'
      return
    }

    if(Date.now() > new Date(tournament.startsat)){
      ctx.response.status = 400
      ctx.response.body = 'tournament already started'
      return
    }

    var res = await strapi.entityService.create('api::tournament-signup.tournament-signup',{
      data:{
        users_permissions_user:memberid,
        tournament:tournamentid,
        checkedin:false,
      }
    })
    ctx.response.body = res
    return
  },

  async checkin(ctx){
    var userid = ctx.request.body.userid
    var tournamentid = ctx.request.body.tournamentid

    var tournament = await strapi.entityService.findOne('api::tournament.tournament',tournamentid,{
      populate:[
        'tournament_signups',
        'tournament_signups.users_permissions_user',
      ],
    })

    var signups = tournament.tournament_signups
    var signup = signups.find(s => s.users_permissions_user.id == userid)
    if(signup == null){
      ctx.response.status = 400
      ctx.response.body = 'not yet signed up'
      return
    }else{
      var updsignup = await strapi.entityService.update('api::tournament-signup.tournament-signup',signup.id,{
        data:{
          checkedin:true,
        }
      })
      ctx.response.body = updsignup
      return
    }
  },


  async generateTree(parent,depth,playercount,players,playercounter,matchcounter,allmatches,tournamentid){
    //create match

    var self = await strapi.entityService.create('api::match.match',{
      data:{
        score1:0,
        score2:0,
        scoreReported:false,
        depth:depth,
        parentMatch:parent?.id,
        tournament:tournamentid,
      }
    })

    if(playercount == 0){

    }else if(playercount == 1){
      self.player1 = players[playercounter.index++].id
    }else if(playercount == 2){
      self.player1 = players[playercounter.index++].id
      self.player2 = players[playercounter.index++].id
    }else if(playercount == 3){
      self.player1 = players[playercounter.index++].id
      this.generateTree(self,depth + 1,2,players,playercounter,matchcounter,allmatches)
    }else{
      var leftsize = Math.ceil(playercount / 2)
      var rightsize = Math.floor(playercount / 2)
      this.generateTree(self,depth + 1,leftsize,players,playercounter,matchcounter,allmatches,tournamentid)
      this.generateTree(self,depth + 1,rightsize,players,playercounter,matchcounter,allmatches,tournamentid)
    }
    // self.name = `${matchcounter.index++}`
    var res = await strapi.entityService.update('api::match.match',self.id,{
      data:self,
      populate:['player1','player2']
    })
    allmatches.push(res)
    return res
  },

  async generatebracket(ctx) {

    var tournamentid = ctx.request.body.tournamentid

    var tournament = await strapi.entityService.findOne('api::tournament.tournament',tournamentid,{
      populate:[
      'tournament_signups',
      'tournament_signups.users_permissions_user',
      'matches'
      ],
    })
    await Promise.all(tournament.matches.map(m => {
      return strapi.entityService.delete('api::match.match',m.id)
    }))

    var signups = tournament.tournament_signups.filter(s => s.checkedin)
    var players = signups.map(s => s.users_permissions_user)
    var resmatches = []
    var res = await this.generateTree(null,0,signups.length,players,{index:0},{index:0},resmatches,tournamentid)
    ctx.body = resmatches
    return
  },

  async reportscore(ctx){

    var matchid = ctx.request.body.matchid
    var userid = ctx.request.body.userid
    var score1 = ctx.request.body.score1
    var score2 = ctx.request.body.score2



    var match = await strapi.entityService.findOne('api::match.match',matchid,{
      populate:[
        'player1',
        'player2',
        'parentMatch',
        'parentMatch.player1',
        'parentMatch.player2',
      ],
    })


    //getmatch
    //check if user == player1 or player2 && scoreported == false

    if((userid == match.player1?.id || userid == match.player2?.id) && (match?.scoreReported ?? false) == false){
      var res = await strapi.entityService.update('api::match.match',match.id,{
        data:{
          score1:score1,
          score2:score2,
          scoreReported:true
        },
      })

      var winner = match.player1
      if(match.score2 > match.score1){
        winner = match.player2
      }

      if(match.parentMatch != null){
        var parentMatchdata = {}
        if(match.parentMatch.player1 == null){
          parentMatchdata.player1 = winner.id
        }else if(match.parentMatch.player2 == null){
          parentMatchdata.player2 = winner.id
        }

        await strapi.entityService.update('api::match.match',match.parentMatch.id,{
          data:parentMatchdata,
          // populate:['player1','player2']
        })
      }
      ctx.response.body = res
      return
    }else{
      ctx.response.status = 400
      ctx.response.body = 'score not updated'
      return
    }

  },

  async test(ctx) {
    ctx.body = 'Hello World!';
  },
}));


