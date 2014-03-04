/**
* Facebook Services
*/
appData.services.UtilServices = Backbone.Model.extend({

	initialize: function() {

	},

	getNetworkConnection: function(){
		// check if there is a working internet / 3G / 4G / WIFI connection to enable the dynamic mode
		var networkState = navigator.connection.type;

		var states = {};
		states[Connection.UNKNOWN]  = false;
		states[Connection.ETHERNET] = true;
		states[Connection.WIFI]     = true;
		states[Connection.CELL_2G]  = true;
		states[Connection.CELL_3G]  = true;
		states[Connection.CELL_4G]  = true;
		states[Connection.CELL]     = false;
		states[Connection.NONE]     = false;

		appData.settings.network = states[networkState];
		return appData.settings.network;
	},

	getLatLon: function(keywords){
		$.ajax({
			url:"http://maps.google.com/maps/api/geocode/json?address="+ keywords +"&sensor=false&region=be",
			type:'GET',
			dataType:'json',
			success:function(data){
				console.log(data);

				var location = data.results[0];
				appData.events.getLatLonEvent.trigger('getLatLonSuccesHandler', location);

			},error: function(){

			}
		});
	},

	getLocationService: function(target){
		// geolocate
		if(appData.settings.native){
			navigator.geolocation.getCurrentPosition(onSuccess, onError);

			var location = [];


			function onSuccess(position) {
				switch(target){
				case "login":
					appData.events.locationHomeEvent.trigger('locationSuccesHandler', position);
					break;
				case "createActivity":

					appData.events.locationCreateActivityEvent.trigger('locationSuccesHandler', position);
					break;
				}
			}

			// onError Callback receives a PositionError object
			function onError(error) {

				switch(target){
				case "login":
					appData.events.locationHomeEvent.trigger('locationErrorHandler', location);
					break;
				case "createActivity":
					appData.events.locationCreateActivityEvent.trigger('locationSuccesHandler', location);
					break;
				}
			}
		}else{
			appData.events.locationEvent.trigger('locationErrorHandler', location);
		}
	}

});
