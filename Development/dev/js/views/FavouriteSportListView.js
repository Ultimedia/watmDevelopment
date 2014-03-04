appData.views.FavouriteSportListView = Backbone.View.extend({

    initialize: function () {

    }, 

    render: function() { 
    	// model to template
    	this.$el.html(this.template(this.model.toJSON()));
        return this; 
    }

});


