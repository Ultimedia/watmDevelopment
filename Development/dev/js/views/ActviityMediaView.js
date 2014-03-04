appData.views.ActivityMediaView = Backbone.View.extend({

    initialize: function () {
      appData.events.getMediaSuccesEvent.bind("mediaLoadSuccesHandler", this.getMediaLoadSuccesHandler);
      appData.services.phpService.getMedia(this.model); 
    },

    events: {
      "click #addMediaButton": "capturePhotoEditHandler"
    },

    getMediaLoadSuccesHandler: function(media){
      console.log(media);

      appData.views.ActivityDetailView.mediaListView = [];
      appData.views.ActivityDetailView.model.attributes.media = media;
      appData.views.ActivityDetailView.model.attributes.media.each(function(mediaModel) {

          var mediaUser = appData.collections.users.where({user_id:mediaModel.attributes.user_id});
              mediaUser = mediaUser[0];
              mediaModel.attributes.userModel = mediaUser.attributes;
              mediaModel.attributes.url = mediaModel.attributes.url;
              mediaModel.attributes.imagePath = appData.settings.imagePath;

          appData.views.ActivityDetailView.mediaListView.push(new appData.views.ActivityMediaViewer({
            model : mediaModel
          }));
      });

      $('#mediaContenListt', appData.settings.currentModuleHTML).empty();
      _(appData.views.ActivityDetailView.mediaListView).each(function(dv) {
          $('#mediaContenListt', appData.settings.currentModuleHTML).append(dv.render().$el);
      });
    },

    render: function() { 
      this.$el.html(this.template(this.model.attributes));
      appData.settings.currentModuleHTML = this.$el;
        return this; 
    },

    capturePhotoEditHandler: function() {
      var page = this.$el;

    // Retrieve image file location from specified source
    navigator.camera.getPicture(this.uploadPhoto,
    function(message) { alert('get picture failed'); },
    { quality: 50, 
    destinationType: navigator.camera.DestinationType.FILE_URI,
    sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY }
    );

    },

    uploadPhoto: function(imageURI) {

      var options = new FileUploadOptions();
      options.fileKey="file";
      options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1)+'.png';
      options.mimeType="text/plain";

      var params = new Object();
      options.params = params;



      var ft = new FileTransfer();
      console.log(ft);

      
      ft.upload(imageURI, encodeURI(appData.settings.rootPath + "services/uploadService.php"), this.win, this.fail, options);
    },

    win: function(r) {
        alert('succes');
        console.log("Code = " + r.responseCode);
        console.log("Response = " + r.response);
        console.log("Sent = " + r.bytesSent);
    },

    fail: function(error) {
        alert("An error has occurred: Code = " + error.code);
        console.log("upload error source " + error.source);
        console.log("upload error target " + error.target);
    }
});

