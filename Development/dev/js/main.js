// data containers
var appData = {
  views: {},
  models: {},
  routers: {},
  utils: {},
  collections: {},
  adapters: {},
  settings: {},
  data: {},
  helpers: {},
  messages: {},
  services: {},
  events: {},
  forms: {},
  garbage: {}
};

// settings
appData.settings.rootPath = "http://localhost/";
appData.settings.servicePath =  appData.settings.rootPath + "services/";
appData.settings.imagePath = appData.settings.rootPath + "common/img/";
appData.settings.badgesPath = appData.settings.rootPath + "common/badges/";
appData.settings.getUserService = "getUser.php";
appData.settings.getUsersService = "getUsers.php";
appData.settings.addUserService = "addUser.php";
appData.settings.getSportsService = "getSports.php";
appData.settings.getActivitiesService = "getActivities.php";
appData.settings.getMessagesService = "getMessages.php";
appData.settings.getChallengesService = "getChallenges.php";
appData.settings.createActivityService = "createActivityService.php";
appData.settings.getUserFromFacebookID = "getUserFromFacebookID.php";
appData.settings.facebookUserToSQL = "facebookUserToSQL.php";
appData.settings.addMessageService = "addMessage.php";
appData.settings.getMediaService = "getMedia.php";
appData.settings.createActivityService = "createActivity.php";
appData.settings.getActivityUserService = "getActivityUser.php";
appData.settings.setGoingToActivityService = "setGoingToActivity.php";
appData.settings.getBuurtenService = "getBuurten.php";
appData.settings.getLocationsService = "getLocations.php";
appData.settings.addLocationService = "addLocation.php";
appData.settings.getMyPlannedActivities = "getMyPlannedActivities.php";
appData.settings.getMyActivities = "getMyActivities.php";
appData.settings.getFavouriteSportsService = "getFavouriteSports.php";
appData.settings.addFavouriteSportsService = "addFavouriteSports.php";
appData.settings.getUserFavouriteSportsService = "getUserFavouriteSports.php";

appData.settings.dataLoaded = false;
appData.settings.userLoggedIn = false;

// messages
appData.messages.passwordIncorrect = "Je paswoord is niet correct";
appData.messages.noUser = "Er werd geen gebruiker met dit email adres gevonden, je kan <a href='#createUser'>hier</a> een nieuwe gebruiker aanmaken.";

/* Jquery Document Read */
$(document).on("ready", function () {
  document.addEventListener("deviceready", onDeviceReady, false);

  // phonegap device ready
  function onDeviceReady() {
      // Now safe to use the PhoneGap API
      appData.settings.phonegapLoaded = true;
  }


  appData.router = new appData.routers.AppRouter();
  appData.utils.templates.load(["HomeView", "DashboardView", "PlannerView", "ProfileView", "ActivityDetailView", "CreateActivityView", "CreateUserView", "NavigationView", "SettingsView", "SportSelectorView", "DashboardActivityView", "LoadingView", "HelperView", "ChallengeListView", "ActivityMessageView", "ActivityMessageView", "ActivityInfoView", "ActivityMediaView", "ActivityMessagesView", "ActivityMediaViewer", "ActivityInfoView", "CreateActivityLocationView", "CreateActivityInfoView", "CreateActivityWieView", "ProfileAvatarView", "ProfileChallengeView", "ProfileFriendsView", "FriendsListView", "FriendView", "ActivityUserView", "PlannerMyActivitiesView", "GoogleMapView", "FavouriteSportListView"],

  // backbone loaded
  function () {

      appData.models.userModel = new User();

      appData.forms.sortOptions = [{"title": "Datum"},{"title": "Afstand"}];
      appData.collections.sortOptions = new SortOptionsCollection(appData.forms.sortOptions);

      // New services class
      appData.services.phpService = new appData.services.PhpServices();
      appData.events.getMessagesSuccesEvent = _.extend({}, Backbone.Events);
      appData.events.getSportsSuccesEvent = _.extend({}, Backbone.Events);
      appData.events.getChallengesSuccesEvent = _.extend({}, Backbone.Events);
      appData.events.getActivitiesSuccesEvent = _.extend({}, Backbone.Events);
      appData.events.getMyActivitiesSuccesEvent = _.extend({}, Backbone.Events);
      appData.events.userLoggedInEvent = _.extend({}, Backbone.Events);
      appData.events.userLoggedInErrorEvent = _.extend({}, Backbone.Events);
      appData.events.userLoggedInPasswordErrorEvent = _.extend({}, Backbone.Events);
      appData.events.createUserEvent = _.extend({}, Backbone.Events);
      appData.events.createUserErrorEvent = _.extend({}, Backbone.Events);
      appData.events.getUserFromFacebookIDEvent = _.extend({}, Backbone.Events);
      appData.events.getUsersSuccesEvent = _.extend({}, Backbone.Events);
      appData.events.facebookUserToSQLEvent = _.extend({}, Backbone.Events);
      appData.events.postMessageSuccesEvent = _.extend({}, Backbone.Events);
      appData.events.getMediaSuccesEvent = _.extend({}, Backbone.Events);
      appData.events.createActivityTabsEvent = _.extend({}, Backbone.Events);
      appData.events.activityUsersSuccesEvent = _.extend({}, Backbone.Events);
      appData.events.goinToActivitySuccesEvent = _.extend({}, Backbone.Events);
      appData.events.getBuurtenEvent = _.extend({}, Backbone.Events);
      appData.events.updateActivitiesEvent = _.extend({}, Backbone.Events);
      appData.events.getLocationsSuccesEvent = _.extend({}, Backbone.Events);
      appData.events.getLatLonEvent = _.extend({}, Backbone.Events);


      appData.services.facebookService = new appData.services.FacebookServices();
      appData.events.facebookLoginEvent = _.extend({}, Backbone.Events);
      appData.events.facebookLoginErrorEvent = _.extend({}, Backbone.Events);
      appData.events.facebookGetFriendsEvent = _.extend({}, Backbone.Events);
      appData.events.facebookGetFriendsErrorEvent = _.extend({}, Backbone.Events);
      appData.events.facebookGetProfileDataEvent = _.extend({}, Backbone.Events);
      appData.events.facebookGetProfileDataErrorEvent = _.extend({}, Backbone.Events);


      appData.services.utilService = new appData.services.UtilServices();
      appData.events.locationHomeEvent = _.extend({}, Backbone.Events);
      appData.events.locationCreateActivityEvent = _.extend({}, Backbone.Events);



      // Create a new instance of the helperclass
      appData.helpers.phonegapHelper = new appData.views.HelperView();

      if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
        appData.settings.rootPath = "http://172.30.39.12/";
        appData.settings.servicePath =  appData.settings.rootPath + "services/";
        appData.settings.imagePath = appData.settings.rootPath + "common/img/";
        appData.settings.badgesPath = appData.settings.rootPath + "common/badges/";

        appData.settings.native = true;
        appData.settings.pictureSource = navigator.camera.PictureSourceType;
        appData.settings.destinationType = navigator.camera.DestinationType;

        // check to see if there is a working connection
        checkConnection();

      } else {
        appData.settings.native = false;
      }

      appData.services.facebookService.facebookConnect();

      // init backbone
      Backbone.history.start();
  });



  // check if there is a working internet / 3G / 4G / WIFI connection to enable the dynamic mode
  function checkConnection() {
    var networkState = navigator.connection.type;

    var states = {};
        states[Connection.UNKNOWN]  = false;
        states[Connection.ETHERNET] = true;
        states[Connection.WIFI]     = true;
        states[Connection.CELL_2G]  = true;
        states[Connection.CELL_3G]  = true;
        states[Connection.CELL_4G]  = true;
        states[Connection.CELL]     = false;
        states[Connection.NONE]     = false;

        appData.settings.network = states[networkState];
  }

});
