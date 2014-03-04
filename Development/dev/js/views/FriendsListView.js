appData.views.FriendsListView = Backbone.View.extend({

    initialize: function () {
 	
    },

    render: function () {
    	// model to template
    	console.log(this.model.attributes);
    	this.$el.html(this.template(this.model.attributes));
        return this; 
    }
});