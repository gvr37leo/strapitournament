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
    var memberid = ctx.state.user.id
    var user = await strapi.entityService.findOne('plugin::users-permissions.user',memberid,{
      fields: ['*'],
      populate:[
        'tournament_signups',
        'tournament_signups.tournament',
      ],
    })
    var tournament = await strapi.entityService.findOne(tournamentapi,tournamentid,{})


    //this can null pointer issues
    if(user.tournament_signups.find(s => s.tournament?.id == tournamentid)){
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
    var userid = ctx.state.user.id
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


  async generateTree(parent,depth,playercount,players,matchcounter,allmatches,tournamentid){
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
      self.player1 = players.splice(0,1)[0].id
    }else if(playercount == 2){
      self.player1 = players.splice(0,1)[0].id
      self.player2 = players.splice(0,1)[0].id
    }else if(playercount == 3){
      self.player1 = players.splice(0,1)[0].id
      await this.generateTree(self,depth + 1,2,players,matchcounter,allmatches,tournamentid)
    }else{
      var leftsize = Math.ceil(playercount / 2)
      var rightsize = Math.floor(playercount / 2)
      await this.generateTree(self,depth + 1,leftsize,players,matchcounter,allmatches,tournamentid)
      await this.generateTree(self,depth + 1,rightsize,players,matchcounter,allmatches,tournamentid)
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

    var signups = tournament.tournament_signups.filter(s => s.checkedin || ctx.request.body.includeAll)

    var players = signups.map(s => s.users_permissions_user)
    var resmatches = []
    var res = await this.generateTree(null,0,signups.length,players,{index:0},resmatches,tournamentid)
    ctx.body = resmatches
    return
  },

  async reportscore(ctx){

    var matchid = ctx.request.body.matchid
    var userid = ctx.state.user.id
    var score1 = ctx.request.body.score1
    var score2 = ctx.request.body.score2



    var match = await strapi.entityService.findOne('api::match.match',matchid,{
      populate:[
        'player1',
        'player2',
        'parentMatch',
        'parentMatch.player1',
        'parentMatch.player2',
        'parentMatch.childMatches'
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
      if(score2 > score1){
        winner = match.player2
      }

      if(match.parentMatch != null){

        var sibling = match.parentMatch.childMatches.find(m => m.id != match.id)
        var parentMatchdata = {}
        if(sibling?.id > match.id && match.parentMatch.player1 == null){
          parentMatchdata.player1 = winner.id
        }else if(match.parentMatch.player2 == null){
          parentMatchdata.player2 = winner.id
        }else if(match.parentMatch.player1 == null){
          parentMatchdata.player1 = winner.id
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

  async getUserWithMatches(ctx){
    var userid = ctx.request.body.userid
    var user = await strapi.entityService.findOne('plugin::users-permissions.user',userid,{
      populate:[
        'matches1',
        'matches1.player1',
        'matches1.player2',
        'matches2',
        'matches2.player1',
        'matches2.player2',
      ],
    })
    ctx.response.body = user
    return
  },

  async getUserWithRole(ctx){
    var userid = ctx.request.body.userid
    var user = await strapi.entityService.findOne('plugin::users-permissions.user',userid,{
      populate:[
        'role',
      ],
    })
    ctx.response.body = user
    return
  },


  async getHomePageData(ctx){
    var tournaments = await strapi.entityService.findMany(tournamentapi,{
      sort:{startsat:'asc'},
      filters:{
        startsat:{
          $gt:Date.now() - (24 * 3600 * 1000),
        }
      },
      populate:['image','tournament_signups','ExternaltournamentLink']
    })
    for(var t of tournaments){
      t.signupcount = t.tournament_signups.length
      delete t.tournament_signups
    }

    var webpages = await strapi.entityService.findMany(wpapi,{
      populate:'*',
      sort:{updatedAt:'desc'},
      filters:{
        parent:{
          id:{
            $notNull:true
          }
        }
      },
      // start:0,
      // limit:10,
      publicationState:'live',
    })

    // var users = await this.getLeaderbordData()

    //tournaments filtered and sorted by startat and get their signup count
    //webpages top 10 sorted by updatedate
    //sorted and top 15 users by their match wins
    ctx.response.body = {
      webpages:webpages,
      tournaments:tournaments,
      // users:users,
      // matches:matches,
    }
    return
  },

  async getLeaderbordData(ctx){
    var users = await strapi.entityService.findMany(usersapi,{
    })
    var matches = await strapi.entityService.findMany(matchapi,{
      populate:[
        'player1','player2'
      ],
      filters:{
        scoreReported:true,
      }
    })
    orderUsers(users,matches)
    users = users.slice(0,ctx.request.body.limit ?? 15)
    ctx.response.body = {
      users:users,
    }
    // return users
  },

  async test(ctx) {
    ctx.body = 'Hello World!';
  },
}));


function orderUsers(users,matches){
  var userdict = {}
  for(var user of users){
      user.wins = 0
      user.tournywins = 0
      user.losses = 0
      user.draws = 0
      userdict[user.id] = user
  }

  for(var match of matches){
      var istournywin = match.depth == 0 ? 1 : 0
      if(match.score1 > match.score2){
          userdict[match.player1.id].wins++
          userdict[match.player1.id].tournywins += istournywin
          userdict[match.player2.id].losses++
      }else if(match.score2 > match.score1){
          userdict[match.player2.id].wins++
          userdict[match.player2.id].tournywins += istournywin
          userdict[match.player1.id].losses++
      }else{
          userdict[match.player1.id].draws++
          userdict[match.player2.id].draws++
      }
  }

  users.sort((a,b) => {
    if(b.tournywins == a.tournywins){
      return b.wins - a.wins
    }else{
      return b.tournywins - a.tournywins
    }
  })
  for(var i = 0; i < users.length;i++){
    users[i].rank = i
  }
  return users
}
