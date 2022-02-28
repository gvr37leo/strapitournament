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
    },
  ]
}
