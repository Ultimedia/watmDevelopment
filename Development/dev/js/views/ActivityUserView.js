appData.views.ActivityUserView = Backbone.View.extend({

    initialize: function () {
    
    }, 

    render: function() { 

    	// model to template
    	this.$el.html(this.template(this.model));
        return this; 
    }

});
