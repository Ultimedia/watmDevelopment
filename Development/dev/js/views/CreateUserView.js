appData.views.CreateUserView = Backbone.View.extend({

	initialize: function () {
        appData.events.createUserEvent.bind("createUserHandler", this.createUserHandler);
        appData.events.createUserErrorEvent.bind("createUserErrorHandler", this.createUserErrorHandler);
        appData.events.locationHomeEvent.bind('locationSuccesHandler', this.locationSuccesHandler);
        appData.events.locationHomeEvent.bind('locationErrorHandler', this.locationErrorHandler);
    }, 

    render: function() { 
        this.$el.html(this.template());
    	appData.settings.currentPageHTML = this.$el;
    	this.setValidator();

    	if(this.model){
    		$('#passwordInput', appData.settings.currentPageHTML).val(this.model.attributes.password);
    		$('#emailInput', appData.settings.currentPageHTML).val(this.model.attributes.email);
    	}
        
        return this; 
    }, 

    createUserHandler: function(){
        appData.router.navigate('dashboard', true);
    },

    createUserErrorHandler: function(){
        alert('cannot create user');
    },

	setValidator: function(){
        $("#createUserForm",appData.settings.currentPageHTML).validate({

    		submitHandler: function(form) {

    			// CreateUser form logic
				var name = $('#nameInput', appData.settings.currentPageHTML).val();
				var password = $('#passwordInput', appData.settings.currentPageHTML).val();
				var email = $('#emailInput', appData.settings.currentPageHTML).val();

				appData.models.userModel = new User();
				appData.models.userModel.set('email', email);
				appData.models.userModel.set('password', password);

                if(appData.settings.native){
                    // First lets get the location
                    appData.services.utilService.getLocationService("login");
                }else{
                    appData.services.phpService.createUser();
                }
		  	}
    	});
    },

    locationSuccesHandler: function(location){
        appData.models.userModel.set('current_location', location);
        appData.services.phpService.createUser();
    },

    locationErrorHandler: function(){
         appData.services.phpService.createUser();
    }

});