/**
* Facebook Services
*/
appData.services.FacebookServices = Backbone.Model.extend({

	initialize: function() {

	},

	facebookConnect: function(){
		if(appData.settings.native){
			// connect facebook API for mobile apps
	        try {
	        	FB.init({ 
	        		appId: "595730207182331", 
	        		nativeInterface: CDV.FB 
	        	});
	        } catch (e) {
	        	alert(e);
	        }
    	}else{
    		try {

	            FB.init({
	                appId: '293375630813769', // App ID
	                status: false // check login status
	            });

			} catch (e) {
				alert(e);
			}
    	}
	},

	facebookUserToSQL: function(){
		$.ajax({
			url:appData.settings.servicePath + appData.settings.facebookUserToSQL,
			type:'POST',
			dataType:'json',
			data: "email="+appData.models.userModel.attributes.email+"&name="+appData.models.userModel.attributes.name+"&facebook_data="+JSON.stringify(appData.models.userModel.attributes.facebook_data)+"&facebook_id="+appData.models.userModel.attributes.facebook_id+"&avatar="+appData.models.userModel.attributes.avatar+"&current_location="+JSON.stringify(appData.models.userModel.attributes.current_location),
			timeout:60000,
			success:function(data){
				if(data.value === true){
					// store the userID
					appData.settings.userLoggedIn = true;
					appData.models.userModel.set('user_id', data.user_id);
					appData.events.facebookUserToSQLEvent.trigger("facebookUserToSQLSuccesHandler");

				}else{
					appData.events.createUserErrorEvent.trigger("createUserErrorHandler");
				}
			}
		});
	},

	getUserFromFacebookID: function(){
	  	$.ajax({
			url:appData.settings.servicePath + appData.settings.getUserFromFacebookID,
			type:'GET',
			dataType:'json',
			data: "facebook_id="+appData.models.userModel.attributes.facebook_id,
			timeout:60000,
			success:function(data){
				appData.events.getUserFromFacebookIDEvent.trigger("facebookGetIDHandler", data);
			}
		});
	},

	facebookLogin: function(){
		FB.login(function(response) {
			appData.settings.userLoggedIn = true;
			appData.events.facebookLoginEvent.trigger("facebookLoginHandler");
	    },{ scope: "email" });
	},

	getProfileData:function(){
		
		FB.api('/me', {fields:['name','email','username','age_range','gender','hometown','link','favorite_athletes','favorite_teams']}, function(response) {

			// store the date in the user profile
			appData.models.userModel.attributes.facebookUser = true;
			appData.models.userModel.attributes.name = response.name;
			appData.models.userModel.attributes.email = response.email;
			appData.models.userModel.attributes.facebook_data.age_range = response.age_range.min;
			appData.models.userModel.attributes.facebook_data.favorite_athletes = response.favorite_athletes;
			appData.models.userModel.attributes.facebook_data.favorite_teams = response.favorite_teams;
			appData.models.userModel.attributes.facebook_data.gender = response.gender;
			appData.models.userModel.attributes.facebook_data.hometown = response.hometown.name;
			appData.models.userModel.attributes.facebook_data.username = response.name;
			appData.models.userModel.attributes.facebook_id = response.id;
			
			FB.api("/me/picture", function(response) {
				appData.models.userModel.attributes.avatar = response.data.url;
				appData.events.facebookGetProfileDataEvent.trigger("facebookProfileDataHandler");
			});

		});
	},

	getFacebookFriends: function(){
		FB.api('/me/friends', { fields: 'id, name, picture' },  function(response) {
	    	if (response.error) {
	        	appData.events.facebookGetFriendsErrorEvent.trigger("facebookGetFriendErrorHandler");

	    	} else {

				appData.models.userModel.attributes.friends = new UsersCollection(response.data);

				// succesfully signed in via Facebook
	        	appData.events.facebookGetFriendsEvent.trigger("facebookGetFriendsHandler");
	    	}
		});
	}

});