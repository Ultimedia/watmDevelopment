appData.views.LoadingView = Backbone.View.extend({

    initialize: function () {
        appData.events.getActivitiesSuccesEvent.bind("activitiesLoadedHandler", this.activitiesLoadedHandler);
        appData.events.getSportsSuccesEvent.bind("sportsLoadedHandler", this.sportsLoadedHandlers);
        appData.events.getChallengesSuccesEvent.bind("challengesLoadedHandler", this.challengesLoadedHandler);
        appData.events.getUsersSuccesEvent.bind("usersLoadedHandler", this.usersLoadedHandler)
        appData.events.getBuurtenEvent.bind("buurtenLoadedHandler", this.buurtenLoadedHandler);
        appData.events.getLocationsSuccesEvent.bind("getLocationsSuccesHandler", this.getLocationsSuccesHandler);
        Backbone.on('myPlannedActivitiesLoadedHandler', this.getMyPlannedActivitiesLoadedHandler);
        Backbone.on('myActivitiesLoadedHandler', this.getMyActivitiesLoadedHandler);
        Backbone.on('getFavouriteSportsHandler', this.getFavouriteSportsHandler)
        Backbone.on('getMyFavouriteSportsHandler', this.getMyFavouriteSportsHandler)

    },

    render: function() {
        this.$el.html(this.template(this.model.attributes));
    	appData.settings.currentPageHTML = this.$el;

        // load the data
        appData.services.phpService.getActivities(true);
        return this;
    },
    activitiesLoadedHandler: function(){
        appData.services.phpService.getSports();
    },

    sportsLoadedHandlers: function(){
        appData.services.phpService.getChallenges();
    },

    challengesLoadedHandler: function(){
        appData.services.phpService.getUsers();
    },

    usersLoadedHandler: function(){
        appData.services.phpService.getBuurten();
    },

    buurtenLoadedHandler: function(){
        appData.services.phpService.getLocations();
    },

    getLocationsSuccesHandler: function(){
        appData.services.phpService.getMyPlannedActivities();
    },

    getMyPlannedActivitiesLoadedHandler: function(){
      Backbone.off('myPlannedActivitiesLoadedHandler');
      appData.services.phpService.getMyActivities();
    },

    getMyActivitiesLoadedHandler: function(){
      Backbone.off('myActivitiesLoadedHandler');
      appData.services.phpService.getFavouriteSports();
    },

    getFavouriteSportsHandler: function(){
        appData.services.phpService.getUserFavouriteSports();
        Backbone.off('getFavouriteSportsHandler');
    },

    getMyFavouriteSportsHandler: function(){
        Backbone.off('getMyFavouriteSportsHandler');
        appData.settings.dataLoaded = true;

        console.log(appData.collections);

        if(appData.collections.myFavouriteSports.length > 0){
            appData.router.navigate('sportselector', true);
        }else{
            appData.router.navigate('sportselector', true);
        }

    }
});
