appData.views.ActivityInfoView = Backbone.View.extend({

    initialize: function () {
        appData.events.goinToActivitySuccesEvent.bind("goingToActivitySuccesHandler", this.goingToActivitySuccesHandler)
        appData.models.activityModel = this.model;
        
        Backbone.on('activityUsersSuccesEvent', this.getActivityUsersSuccesHandler);
        appData.services.phpService.getActivityUsers(this.model); 
    },

    render: function() { 
    	this.$el.html(this.template(this.model.attributes));
    	appData.settings.currentModuleHTML = this.$el;

        $('#praktischContent .radio-list input[type="radio"]', this.$el).change(function() {
                    // Remove all checked
            $(this).parents('.radio-list').find('label').removeClass('checked');
            $(this).parent().addClass('checked');

            var selectedData = $(this).attr('id');
                selectedData = selectedData.split('-');
                selectedData = selectedData[1];

                appData.services.phpService.setGoingToActivity(appData.models.activityModel.attributes.activity_id, selectedData);
        });

        return this; 
    },



    getActivityUsersSuccesHandler: function(data){
        appData.models.activityModel.userData = new UsersCollection(data);

        // 1 set toggle switch for going
        var goingTo = appData.models.activityModel.userData.where({user_id:appData.models.userModel.attributes.user_id.toString()});
            goingTo = goingTo[0];

        if(goingTo){
            if(goingTo.length > 0){
                $('#praktischContent .radio-list label').removeClass('checked');
                $("#going-" + goingTo.attributes.going, appData.settings.currentModuleHTML).parent().addClass('checked');
                $("#going-" + goingTo.attributes.going, appData.settings.currentModuleHTML).prop('checked', true);
            }
        }

        // 2 show friends that are going
        $('#aanwezigContent').empty();
        appData.views.ActivityInfoView.userListView = [];
        appData.views.ActivityDetailView.model.attributes.users = data;
        $(appData.views.ActivityDetailView.model.attributes.users).each(function(index,userModel) {
          appData.views.ActivityInfoView.userListView.push(new appData.views.ActivityUserView({
            model : userModel
        }));

        $('#aanwezigContent', appData.settings.currentModuleHTML).empty();
        _(appData.views.ActivityInfoView.userListView).each(function(dv) {

          $('#aanwezigContent', appData.settings.currentModuleHTML).append(dv.render().$el);
        });
      });

        Backbone.off('activityUsersSuccesEvent', appData.views.ActivityInfoView.getActivityUsersSuccesHandler);
    }
});

