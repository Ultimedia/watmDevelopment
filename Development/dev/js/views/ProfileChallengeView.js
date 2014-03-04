appData.views.ProfileChallengeView = Backbone.View.extend({

    initialize: function () {
        appData.views.challengeListView = [];
        appData.collections.challenges.each(function(challenge) {
        appData.views.challengeListView.push(new appData.views.ChallengeListView({
            model : challenge
          }));
        });
    },

    render: function() { 
    	this.$el.html(this.template());
        appData.settings.currentModuleHTML = this.$el;

        _(appData.views.challengeListView).each(function(listView) {
            $('#challengesList', appData.settings.currentModuleHTML).append(listView.render().$el);
        });

        return this; 
    }
});