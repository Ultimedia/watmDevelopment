appData.views.SportSelectorView = Backbone.View.extend({

    initialize: function () {
        appData.views.SportSelectorView.selectedSports = [];
        Backbone.on('addFavouriteSportsHandler', this.addFavouriteSportsHandler)
    
        appData.views.SportSelectorView.model = this.model;
    },

    render: function() {
    	this.$el.html(this.template());
        appData.settings.currentPageHTML = this.$el;


        appData.views.SportSelectorView.favouriteSportsViewList = [];

        appData.collections.favouriteSports.each(function(sport){
            appData.views.SportSelectorView.favouriteSportsViewList.push(new appData.views.FavouriteSportListView({
                model : sport
            }));
        });

        var generateGri = this.generateGrid();

        appData.views.CreateActivityLocationView.locationAutComplete = new AutoCompleteView({input: $("#sportInput", appData.settings.currentPageHTML), model: appData.collections.sports, wait: 100, updateModel: this.model, updateID: "sport_id", onSelect: function(sport){
            sport.attributes.object_class = "selected";
            appData.views.SportSelectorView.favouriteSportsViewList.push(new appData.views.FavouriteSportListView({
                model : sport
            }));

            $('#favouriteSportList', appData.settings.currentPageHTML).empty();
            _(appData.views.SportSelectorView.favouriteSportsViewList).each(function(listView) {
                $('#favouriteSportList', appData.settings.currentPageHTML).append(listView.render().$el);
            });

        }}).render();

        return this;

    },

    generateGrid: function(){
        $('#favouriteSportList', appData.settings.currentPageHTML).empty();
        _(appData.views.SportSelectorView.favouriteSportsViewList).each(function(listView) {
            $('#favouriteSportList', appData.settings.currentPageHTML).append(listView.render().$el);
        });
    },

    events: {
      "click #confirm": "confirmSportsHandler",
      "click #favouriteSportList a": "favouriteSportClickHandler"
    },

    favouriteSportClickHandler: function(evt){
        $(evt.target).toggleClass('selected');
    },

    confirmSportsHandler: function(){
        var selectedSports = [];

        $('#favouriteSportList .selected', appData.settings.currentPageHTML).each(function(index, element){
            var sportID = $(element).attr('data-id');
            var model = appData.collections.sports.where({'sport_id': sportID.toString()})
        
            selectedSports.push(model[0]);
        });

        appData.services.phpService.addFavouriteSportsService(selectedSports);
    },

    addFavouriteSportsHandler: function(){
        appData.router.navigate('dashboard', true);
    }
});
