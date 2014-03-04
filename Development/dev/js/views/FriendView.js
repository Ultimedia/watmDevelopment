appData.views.FriendView = Backbone.View.extend({

    initialize: function () {
      console.log('----- In the initialize of FriendView -----');
      appData.views.FriendView.model = this.model;
    },

    render: function() { 
      this.$el.html(this.template(this.model.attributes));
      appData.settings.currentPageHTML = this.$el;
      return this; 
    }, 

    events: {
      "click #backButton": "backHandler"
    },

    backHandler: function(){
      window.history.back();
    },

});

