appData.views.DashboardActivityView = Backbone.View.extend({

    initialize: function () {

    }, 

    render: function() { 
    	// model to template
    	this.$el.html(this.template(this.model.attributes));
        return this; 
    }

});





