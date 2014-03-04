appData.views.CreateActivityLocationView = Backbone.View.extend({

    initialize: function () {
        appData.events.locationCreateActivityEvent.bind('locationSuccesHandler', this.locationSuccesHandler);
        appData.events.locationCreateActivityEvent.bind('locationErrorHandler', this.locationErrorHandler);
    
        appData.events.getLatLonEvent.bind('getLatLonSuccesHandler', this.getLatLonSuccesHandler);
        Backbone.on('addedLocationSuccesEvent', this.addedLocationSuccesEvent);

        this.currentMapLocation ="";
        this.wait = false;

        appData.views.CreateActivityLocationView.tabTarget = {};
        appData.views.CreateActivityLocationView.tabTarget.location = "#wieContent";
        appData.views.CreateActivityLocationView.tabTarget.tab = "#wieTab";
    },

    events: {
        "keyup #locationInput": "locationChangeHandler"
    },

    getLatLonSuccesHandler: function(data){
        if(data.geometry){
           appData.views.CreateActivityLocationView.currentMapLocation = data.geometry.location.lat + "," + data.geometry.location.lng;

           var marker = new google.maps.Marker({
              position: new google.maps.LatLng(data.geometry.location.lat, data.geometry.location.lng),
              map:  appData.views.CreateActivityLocationView.map,
              title: data.formatted_address
            });

            appData.views.CreateActivityLocationView.map.setCenter(new google.maps.LatLng(data.geometry.location.lat, data.geometry.location.lng), 13);
        }
    },

    locationChangeHandler: function(){

        // location from autocomplete
        if($('#locationInput',  appData.settings.currentModuleHTML).val().length > 3){

            if(appData.views.ActivityDetailView.model.attributes.location_id){

                var selectedLocationModel = appData.collections.locations.where({ "location_id": appData.views.ActivityDetailView.model.attributes.location_id });
                    if(selectedLocationModel){
                        selectedLocationModel = selectedLocationModel[0];

                        var coordinates = selectedLocationModel.attributes.coordinates.split(',');
                            appData.views.CreateActivityLocationView.map.setCenter(new google.maps.LatLng(coordinates[0], coordinates[1]), 13);
                    }

            }else{
                appData.services.utilService.getLatLon($('#locationInput').val());
            }
        }

    },

    addedLocationSuccesEvent: function(location_id){
        appData.views.ActivityDetailView.model.attributes.location_id = location_id;

        console.log(appData.views.ActivityDetailView.model.attributes);

        appData.events.createActivityTabsEvent.trigger('formStageCompleteEvent', appData.views.CreateActivityLocationView.tabTarget);
    },

    render: function() { 
      this.$el.html(this.template());
      appData.settings.currentModuleHTML = this.$el;
      appData.views.CreateActivityLocationView.locationAutComplete = new AutoCompleteView({input: $("#locationInput", appData.settings.currentModuleHTML), model: appData.collections.locations, wait: 100, updateModel: appData.views.ActivityDetailView.model, updateID: "location_id"}).render();

      this.setValidators();
      this.initMap();

      return this; 
    },

    initMap: function() { 
        appData.settings.mapAdded = true;

        var mapOptions = {
            zoom: 15,
            center: new google.maps.LatLng(51.20935, 3.22470),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: true
        }
        var page = this.$el;
        appData.views.CreateActivityLocationView.map = new google.maps.Map($('#map_canvas',page)[0], mapOptions);
    
        if(appData.settings.native){
            appData.services.utilService.getLocationService("createActivity");
        }

    },

    locationSuccesHandler: function(position){


        appData.views.CreateActivityLocationView.map.setCenter(new google.maps.LatLng(position.coords.latitude, position.coords.longitude), 13);
        var marker = new google.maps.Marker({
          position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
          map:  appData.views.CreateActivityLocationView.map,
          title: 'Huidige locatie'
        });

    },

    locationErrorHandler: function(location_id){

    },

    setValidators: function(){
    	var that = this;
    	$("#waarForm",appData.settings.currentModuleHTML).validate({
            submitHandler: function(form){                
                appData.views.ActivityDetailView.model.attributes.location = $('#locationInput', appData.settings.currentModuleHTML).val();

                // Is this a custom locaiton or not?
                var found = appData.collections.locations.findWhere({'location': $('#locationInput', appData.settings.currentModuleHTML).val()})
                if(!found){
                    // Add location to database
                    appData.services.phpService.addLocation($('#locationInput',appData.settings.currentModuleHTML).val(), appData.views.CreateActivityLocationView.currentMapLocation,"");
                }else{
                    appData.events.createActivityTabsEvent.trigger('formStageCompleteEvent', appData.views.CreateActivityLocationView.tabTarget);
                }
            }
        });
    }
});