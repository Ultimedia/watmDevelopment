appData.routers.AppRouter = Backbone.Router.extend({

    routes: {
        "":                 "home",
        "dashboard":        "dashboard",
        "planner":          "planner",
        "profile": 			"profile",
        "activity/:id":     "activity",
        "navigater":        "navigater", 
        "createActivity":   "createActivity",
        "createUser":       "createUser",
        "settings":         "settings",
        "sportselector":    "sportselector",
        "loading":          "loading",
        "friend/:id":        "friend"
    },



    initialize: function () {
        appData.slider = new PageSlider($('body'));

        this.routesHit = 0;
        
        //keep count of number of routes handled by your application
        Backbone.history.on('route', function() { this.routesHit++; }, this);
    },

    back: function() {
        if(this.routesHit > 1) {
          //more than one route hit -> user did not land to current page directly
          window.history.back();
        } else {
          //otherwise go to the home page. Use replaceState if available so
          //the navigation doesn't create an extra history entry
          this.navigate('/', {trigger:true, replace:true});
        }
    },

    home: function () {
        appData.slider.slidePage(new appData.views.HomeView().render().$el);
    },

    loading: function () {
        appData.slider.slidePage(new appData.views.LoadingView({model: appData.models.userModel}).render().$el);
        
    },
    
    dashboard: function () {

        if(appData.settings.userLoggedIn){

            if(appData.settings.dataLoaded){                
                appData.slider.slidePage(new appData.views.DashboardView().render().$el);
            }else{
                window.location.hash = "loading";
            }
        }else{
            window.location.hash = "";
        }
    },

    planner: function () {
        if(appData.settings.userLoggedIn){

            appData.slider.slidePage(new appData.views.PlannerView().render().$el);
        }else{
            window.location.hash = "";
        }
    },

    profile: function () {
        if(appData.settings.userLoggedIn){
            appData.slider.slidePage(new appData.views.ProfileView().render().$el);
        }else{
            window.location.hash = "";
        }
    },

    friend: function(id){
        var userModel = appData.collections.users.where({ "user_id": id });
            userModel = userModel[0];

            console.log(userModel);
        
        appData.slider.slidePage(new appData.views.FriendView({model: userModel}).render().$el); 
    },

    activity: function (id) {
        appData.slider.slidePage(new appData.views.ActivityDetailView().render().$el); 
    },

    createActivity: function () {
        if(appData.settings.userLoggedIn){

            if(appData.settings.dataLoaded){
                appData.slider.slidePage(new appData.views.CreateActivityView({model: appData.models.userTemplate}).render().$el);
            }else{
                window.location.hash = "loading";
            }
        }else{
            window.location.hash = "";
        }

    },

    createUser: function () {
        appData.slider.slidePage(new appData.views.CreateUserView({model: appData.models.userModel}).render().$el);
    },
    
    navigater: function (id) {
        appData.slider.slidePage(new appData.views.NavigationView().render().$el);
    },

    activity: function (id) {
        if(appData.settings.userLoggedIn){

            if(appData.settings.dataLoaded){
                var activitiesCollection = appData.collections.activities;
                var selectedActivityModel = activitiesCollection.where({activity_id: id}); 
                    selectedActivityModel = selectedActivityModel[0];

                var view = new appData.views.ActivityDetailView({model: selectedActivityModel});
                    appData.slider.slidePage(view.render().$el);

            }else{
                window.location.hash = "loading";
            }
        }else{
            window.location.hash = "";
        }
    },

    settings: function (id) {
        appData.slider.slidePage(new appData.views.SettingsView().render().$el);
    },

    sportselector: function (id) {
        appData.slider.slidePage(new appData.views.SportSelectorView({ model: new Backbone.Model({"sport_id": ""})}).render().$el);
    },

    checkLoggedIn: function(){

    }
});