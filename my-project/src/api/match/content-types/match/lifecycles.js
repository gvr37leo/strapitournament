// https://docs.strapi.io/developer-docs/latest/development/backend-customization/models.html#lifecycle-hooks



module.exports = {
    beforeUpdate(e){
    },

    afterUpdate(e){
      //when a match is deleted, remove the wins and losses from that user
      //when a match is updated remove old windata and insert the new win data(check params.data)
      //when a match is created, this is already done in the score reported data
    },
}


// beforeCreate
// beforeCreateMany
// afterCreate
// afterCreateMany
// beforeUpdate
// beforeUpdateMany
// afterUpdate
// afterUpdateMany
// beforeDelete
// beforeDeleteMany
// afterDelete
// afterDeleteMany
// beforeCount
// afterCount
// beforeFindOne
// afterFindOne
// beforeFindMany
// afterFindMany
