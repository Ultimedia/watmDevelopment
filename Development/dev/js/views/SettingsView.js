appData.views.SettingsView = Backbone.View.extend({

    initialize: function () {

    },

    render: function () {
    	console.log(appData.models.userModel.attributes);

        this.$el.html(this.template({user: appData.models.userModel.attributes}));
        appData.settings.currentPageHTML = this.$el;
        return this;
    }
});