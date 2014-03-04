appData.views.CreateActivityView = Backbone.View.extend({

    initialize: function () {
        appData.views.ActivityDetailView.model = new Activity();
        appData.events.createActivityTabsEvent.bind("formStageCompleteEvent", this.formStageCompleteEvent);
    },

    render: function() { 
    	this.$el.html(this.template());
        this.currentActivityPage = '#watContent';

        appData.settings.currentPageHTML = this.$el;
        
        var view = new appData.views.CreateActivityInfoView({ model:  appData.views.ActivityDetailView.model});
        $('#createActivityContent', appData.settings.currentPageHTML).empty().append(view.render().$el);

        return this; 
    }, 

    formStageCompleteEvent: function(data){

        var location = data.location;
        var tab = data.tab;

        $('#createActivityTabs .cl-btn').removeClass('active');
        $(tab, appData.settings.currentPageHTML).addClass('active');

        // tab on activity detail
        $(this.currentActivityPage, appData.settings.currentPageHTML).removeClass('show').addClass('hide');
        $(location, appData.settings.currentPageHTML).removeClass('hide').addClass('show');

        this.currentActivityPage = location;

        var view;
        switch(location){
            case "#watContent":
                view = new appData.views.CreateActivityInfoView({ model:  appData.views.ActivityDetailView.model});
            break;

            case "#waarContent":
                view = new appData.views.CreateActivityLocationView({ model:  appData.views.ActivityDetailView.model});
            break;

            case "#wieContent": 
                view = new appData.views.CreateActivityWieView({ model:  appData.views.ActivityDetailView.model});
            break;
        }

        $('#createActivityContent', appData.settings.currentPageHTML).empty().append(view.render().$el);
        
    }
});

