appData.views.PlannerView = Backbone.View.extend({

  initialize: function () {
    Backbone.on('myPlannedActivitiesLoadedHandler', this.updatePlanner);
    Backbone.on('myActivitiesLoadedHandler', this.updatePlannerComplete);

    appData.services.phpService.getMyPlannedActivities();
  },

  updatePlanner: function(){
    appData.services.phpService.getMyActivities();
  },

  updatePlannerComplete: function(){
    Backbone.off('myPlannedActivitiesLoadedHandler', this.updatePlanner);
    Backbone.off('myActivitiesLoadedHandler', this.updatePlannerComplete);

    appData.views.PlannerView.myActivitiesView = [];
    appData.views.PlannerView.myJoinedActivitiesView = [];

    // get my activities
    appData.collections.myActivities.each(function(activity) {
      appData.views.PlannerView.myActivitiesView.push(new appData.views.PlannerMyActivitiesView({model : activity}));
    });

    // get the activities I'm going to
    appData.collections.myPlannedActivities.each(function(myActivity) {
      appData.views.PlannerView.myJoinedActivitiesView.push(new appData.views.PlannerMyActivitiesView({model : myActivity}));
    });


    if(appData.views.PlannerView.myActivitiesView.length > 0){
      $('#myActivitiesPlanner', appData.settings.currentPageHTML).removeClass('hide');
      $('#myActivitiesTable', appData.settings.currentPageHTML).empty();

      _(appData.views.PlannerView.myActivitiesView).each(function(dv) {
        $('#myActivitiesTable', appData.settings.currentPageHTML).append(dv.render().$el);
      });
    }

    if(appData.views.PlannerView.myJoinedActivitiesView.length > 0){
      $('#myPlanner', appData.settings.currentPageHTML).removeClass('hide');
      $('#myPlanningTable', appData.settings.currentPageHTML).empty();

      _(appData.views.PlannerView.myJoinedActivitiesView).each(function(dv) {
        $('#myPlanningTable', appData.settings.currentPageHTML).append(dv.render().$el);
      });
    }
  },

  render: function () {
    this.$el.html(this.template());
    appData.settings.currentPageHTML = this.$el;


    return this;
  }
});
