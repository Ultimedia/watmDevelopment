User = Backbone.Model.extend({
	defaults: {
	    user_id: '',
	    name: '',
	    email: '',
	    facebook_data: {},
	    facebookUser: false,
	    friends: [],
	    avatar :'common/img/avatar.png',
	    current_location: "50.827404, 3.254647"
    },
	initialize: function(){
		
	}
});

