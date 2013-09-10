(function () {
	var app, streamManager;
	Livefyre.require('streamhub-sdk/stream-helpers/livefyre-helper');
	var Oembed = Livefyre.require('streamhub-sdk/content/types/oembed');
	var ListView = Livefyre.require('streamhub-sdk/views/list-view'),
	$ = Livefyre.require('jquery');

	var LivefyreReverseStream = Livefyre.require('streamhub-sdk/streams/livefyre-reverse-stream');

	//handle the featured items - inject them into the stream
	// var _oldSetInitData = LivefyreReverseStream.prototype._setInitData;
	// LivefyreReverseStream.prototype._setInitData = function (initData) {
	//     this._featuredDoc = initData.featured;
	//     this._handledFeaturedDoc = false;
	//     return _oldSetInitData.apply(this, arguments);
	// }

	// var _oldRead = LivefyreReverseStream.prototype._read;
	// LivefyreReverseStream.prototype._read = function () {
	//     var featuredDoc = this._featuredDoc;

	//     if ( ! this._handledFeaturedDoc) {
	//         this._handleBootstrapDocument(featuredDoc);
	//         this._handledFeaturedDoc = true;
	//     }

	//     return _oldRead.apply(this, arguments);
	// }

	// var _oldHandleState = LivefyreReverseStream.prototype._handleState;
	// LivefyreReverseStream.prototype._handleState = function (state, authors) {
	//     var authorsMap = {};
	//     if (typeof authors.length !== 'undefined') {
	//         for (var i=0, numAuthors=authors.length; i < numAuthors; i++) {
	//             var author = authors[i];
	//             authorsMap[author.id] = author;
	//         }
	//         authors = authorsMap
	//     }
	//     return _oldHandleState.apply(this, [state, authors]);
	// }


	function PackeryView (opts) {
		this._elementsAwaitingLayout = [];
		this._layoutTimeout = null;
		this._theBigOne = null;
		Packery.call(this, opts.el, opts);
		ListView.call(this, opts);
        this.$el.addClass('packery');
	}
	PackeryView.prototype = new ListView();
	$.extend(PackeryView.prototype, Packery.prototype);

	Packery.prototype.comparator = function (a, b) {
		return a.createdAt - b.createdAt;
	};

	PackeryView.prototype.add = function (content) {
		var self = this;
		var contentView = ListView.prototype.add.apply(this, arguments);
		//var didPrepend = false;

		//if there's a new style attachment in the content
		// if (contentView.content.meta.content.attachments) {
	 //        var rawOembed = contentView.content.meta.content.attachments[0],
	 //            oembed = new Oembed(rawOembed);
	 //        contentView.content.addAttachment(oembed);
	 //        contentView.render();
	        
	 //    }


      if (contentView.content.meta.content.annotations.featuredmessage) {
			self._theBigOne = contentView;
			contentView.$el.addClass('featured-content');
			self.stamp([self._theBigOne.el]);
            self.layout();
        } else {
            contentView.$el.addClass('item');
            self.appended([contentView.el]);
        }
        
      contentView.$el.on('imageLoaded.hub', function () {
			  self.layout();
			  console.log('new item with an image');
		  });
        
		return contentView;
	}

	window.app = app = new PackeryView({
	    el: document.getElementById('livefyre-app-cox-1378248103051'),
       /* gutter: 15*/
	});


	streamManager = Livefyre.require('streamhub-sdk/stream-manager').create.livefyreStreams({
		    "articleId": "lf-csuat-test-005", 
		    "siteId": 303990, 
		    "network": "client-solutions-uat.fyre.co"
	});
	
	streamManager.bind(app).start();
	
}());