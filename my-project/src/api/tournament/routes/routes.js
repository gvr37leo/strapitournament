module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/signup',
      handler: 'tournament.signup',
    },{
      method: 'POST',
      path: '/checkin',
      handler: 'tournament.checkin',
    },{
      method: 'POST',
      path: '/generatebracket',
      handler: 'tournament.generatebracket',
    },{
      method: 'POST',
      path: '/reportscore',
      handler: 'tournament.reportscore',
    },{
      method: 'POST',
      path: '/test',
      handler: 'tournament.test',
    },{
      method: 'POST',
      path: '/getUserWithMatches',
      handler: 'tournament.getUserWithMatches',
    },{
      method: 'POST',
      path: '/getUserWithRole',
      handler: 'tournament.getUserWithRole',
    },{
      method: 'POST',
      path: '/getHomePageData',
      handler: 'tournament.getHomePageData',
    },{
      method: 'POST',
      path: '/getLeaderbordData',
      handler: 'tournament.getLeaderbordData',
    },{
      method: 'POST',
      path: '/finalizeTournament',
      handler: 'tournament.finalizeTournament',
    },{
      method: 'POST',
      path: '/finalizeSeason',
      handler: 'tournament.finalizeSeason',
    },{
      method: 'POST',
      path: '/cleanup',
      handler: 'tournament.cleanup',
    },









  ]
}
