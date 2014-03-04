appData.views.HomeView = Backbone.View.extend({

    initialize: function () {
        appData.events.userLoggedInEvent.bind("userLoggedInHandler", this.userLoggedInHandler);
        appData.events.userLoggedInErrorEvent.bind("userLoggedInErrorHandler", this.userLoggedInErrorHandler);
        appData.events.userLoggedInPasswordErrorEvent.bind("userLoggedInPasswordErrorHandler", this.userLoggedInPasswordErrorHandler);
        appData.events.facebookLoginEvent.bind("facebookLoginHandler", this.facebookLoginHandler);
        appData.events.facebookLoginErrorEvent.bind("facebookLoginErrorHandler", this.facebookLoginErrorHandler);
        appData.events.facebookGetFriendsEvent.bind("facebookGetFriendsHandler", this.facebookGetFriendsHandler);
        appData.events.facebookGetFriendsErrorEvent.bind("userLoggedInPasswordErrorHandler", this.facebookGetFriendErrorHandler);
        appData.events.facebookGetProfileDataEvent.bind("facebookProfileDataHandler", this.facebookProfileDataHandler);
        appData.events.getUserFromFacebookIDEvent.bind("facebookGetIDHandler", this.facebookGetIDHandler)
        appData.events.facebookUserToSQLEvent.bind('facebookUserToSQLSuccesHandler', this.facebookUserToSQLSuccesHandler);
        appData.events.locationHomeEvent.bind('locationSuccesHandler', this.locationSuccesHandler);
        appData.events.locationHomeEvent.bind('locationErrorHandler', this.locationErrorHandler);
    },

    render: function() { 
    	this.$el.html(this.template());
    	appData.settings.currentPageHTML = this.$el;
    	this.setValidator();
        return this; 
    },

    events: {
        "click #FBloginButton": "facebookClickHandler",
        "submit #loginForm": "loginFormSubmitHandler"
    },

	setValidator: function(){
    	$("#loginForm",appData.settings.currentPageHTML).validate({
    		submitHandler: function(form) {
			 	// Store page
				var email = $('#emailInput', appData.settings.currentPageHTML).val();
				var password = $('#passwordInput', appData.settings.currentPageHTML).val();

				appData.models.userModel.set('email', email);
				appData.models.userModel.set('password', password);

                appData.services.phpService.userLogin();
		  	}
    	});
    },

    /**
    * Facebook login flow 
    */
    facebookUserToSQLSuccesHandler: function(){
        appData.router.navigate('loading', true);
    },

    facebookGetIDHandler: function(newUser){
        if(!newUser.facebook_user){
            console.log("nieuwe gebruiker");

            if(appData.settings.native){
                // First lets get the location
                appData.services.utilService.getLocationService("login");
            }else{
                appData.services.facebookService.facebookUserToSQL();
            }

        }else{
            appData.models.userModel.set('user_id', newUser.user_id);

            if(appData.settings.native){
                appData.services.utilService.getLocationService("login");
            }else{
                appData.router.navigate('loading', true);
            }

            // Excisting user, do nothing for now
            appData.router.navigate('loading', true);          
        }
    },

    locationSuccesHandler: function(location){
        var myLocation = location.coords.coordinates.latitude + "," + location.coords.coordinates.longitude;

        appData.models.userModel.set('current_location', myLocation);
        appData.services.facebookService.facebookUserToSQL();
    },

    locationErrorHandler: function(){
        appData.services.facebookService.facebookUserToSQL();
    },

    facebookProfileDataHandler: function(){
        // get friends
        appData.services.facebookService.getFacebookFriends();
    },

    facebookLoginHandler: function(){
        // fetch profile data
        appData.services.facebookService.getProfileData();
    },

    facebookGetFriendsHandler: function(){
        // finished loading facebook data, forward to login screen
        appData.services.facebookService.getUserFromFacebookID();
    },

    facebookClickHandler: function(){
        appData.services.facebookService.facebookLogin();
    },

    facebookLoginErrorHandler: function(){
        alert('error loggin on to facebook')
    },

    facebookGetFriendErrorHandler: function(){
        alert('error getting friends from facebook');
    },

    /**
    * Normal Login flow
    */
    userLoggedInHandler: function(){
        $('#loginForm .error-box', appData.currentPageHTML).removeClass('show').addClass('hide');
        appData.router.navigate('loading', true);
    },

    userLoggedInPasswordErrorHandler: function(){
        $('#loginForm .error-box', appData.currentPageHTML).html(appData.messages.passwordIncorrect).removeClass('hide').addClass('show');
    },

    userLoggedInErrorHandler: function(){
        appData.router.navigate('createUser', true);
    }

});