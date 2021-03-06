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
console.log('tournament.js')

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

    var players = signups.map(s => s.users_permissions_user).filter(user => user != null)
    shuffle(players)
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

  async finalizeTournament(ctx){
    //get the users
    //get the matches
    //count the wins and losses
    //save on the users
    var tournamentid = ctx.request.body.tournamentid
    var tournament = await strapi.entityService.findOne(tournamentapi, tournamentid,{
      populate:[
      'tournament_signups',
      'tournament_signups.users_permissions_user',
      'matches',
      'matches.player1',
      'matches.player2',
      ],
    })

    if(tournament.includeOnLeaderboard && tournament.finished == false){
      var users = tournament.tournament_signups.map(signup => signup.users_permissions_user)
      var matches = tournament.matches
      orderUsers(users,matches)

      for(var user of users){
        var res = await strapi.entityService.update(usersapi,user.id,{
          data:{
            wins:user.wins,
            losses:user.losses,
            draws:user.draws,
            tournywins:user.tournywins,
          },
        })
      }
    }

    var res = await strapi.entityService.update(tournamentapi,tournamentid,{
      data:{
        finished:true,
      }
    })
    ctx.response.body = res
    return
  },

  async cleanup(ctx){

    var users = await strapi.entityService.findMany(usersapi,{
      sort:[{tournywins:'desc'},{wins:'desc'}]
    })

    for(var user of users){
      var newdata = {}
      if(user.wins == null){
        newdata.wins = 0
      }
      if(user.losses == null){
        newdata.losses = 0
      }
      if(user.draws == null){
        newdata.draws = 0
      }
      if(user.tournywins == null){
        newdata.tournywins = 0
      }
      var res = await strapi.entityService.update(usersapi,user.id,{
        data:newdata,
      })
    }

    ctx.reponse.body = {}
    return
  },

  async finalizeSeason(ctx){
    //create a new season
    //dump all the players scores in there
    //set all the players data to 0
    var users = await strapi.entityService.findMany(usersapi,{
      sort:[{tournywins:'desc'},{wins:'desc'}]
    })

    var newseason = await strapi.entityService.create('api::season.season',{
      data:{
        name:'new season',
        data:users,
      }
    })

    for(var user of users){
      var res = await strapi.entityService.update(usersapi,user.id,{
        data:{
          wins:0,
          losses:0,
          draws:0,
          tournywins:0,
        },
      })
    }


    ctx.response.body = newseason
    return
  },

  async getLeaderbordData(ctx){
    var users = await strapi.entityService.findMany(usersapi,{
    })

    //only get matches belonging to active tournaments
    try {
      var activeTournaments = await strapi.entityService.findMany(tournamentapi,{
        populate:[
          'matches',
          'matches.player1',
          'matches.player2',
        ],
        filters:{
          $and:[{startsat:{$lt:Date.now()}},{startsat:{$gt:Date.now() - 24 * 3600 * 1000}}],
          finished:false,
          includeOnLeaderboard:true,
        }
      })
      var activematches = activeTournaments.flatMap(t => t.matches).filter(m => m.scoreReported)
      orderUsers(users,activematches)
      users = users.slice(0,ctx.request.body.limit ?? 16)
      ctx.response.body = {
        users:users,
      }
      return
    } catch (error) {
      console.log(error)
    }
  },

  async test(ctx) {
    ctx.body = 'Hello World!';
  },
}));


function orderUsers(users,matches){
  var userdict = {}
  for(var user of users){
      userdict[user.id] = user
  }

  for(var match of matches){
    if(match.scoreReported == false){
      continue
    }
    var istournywin = match.depth == 0 ? 1 : 0
    var winner = null
    var loser = null
    if(match.score1 > match.score2){
      winner = userdict[match.player1?.id] ?? null
      loser = userdict[match.player2?.id] ?? null
    }else if(match.score2 > match.score1){
      winner = userdict[match.player2?.id] ?? null
      loser = userdict[match.player1?.id] ?? null
    }else{
      if(match.player1){
        userdict[match.player1.id].draws++
      }
      if(match.player2){
        userdict[match.player2.id].draws++
      }
    }
    if(winner){
      winner.wins++
      winner.tournywins += istournywin
    }
    if(loser){
      loser.losses++
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

function shuffle(arr){
  for(var i = arr.length - 1; i > 0; i--){
    swap(arr,i,Math.floor(Math.random() * i))
  }
}

function swap(arr,a,b){
  var temp = arr[a]
  arr[a] = arr[b]
  arr[b] = temp
}
