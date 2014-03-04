appData.views.CreateActivityWieView = Backbone.View.extend({
    initialize: function () {

    },

    render: function() { 
      this.$el.html(this.template(this.model.attributes));
      appData.settings.currentModuleHTML = this.$el;
      this.setValidator();
      return this; 
    },

    setValidator: function(){
    	var that = this;
        $("#wieForm",appData.settings.currentModuleHTML).validate({

            submitHandler: function(form){
                appData.services.phpService.createActivity(appData.views.ActivityDetailView.model);
            }
        });
    }

});