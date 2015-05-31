var Promise = require('es6-promise').Promise;
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var AppDispatcher = require('../../AppDispatcher');
var __SETTINGS = require('../../conf.jsx');
var PostConstants = require('./constants');

var CHANGE_EVENT = 'change';


var PostsStore = assign({}, EventEmitter.prototype, {
	_posts: [],
	_removed_posts: [],
	_ajax_loading: [],
	_new_posts_history: [],
	_appendposts: [],
	wall_offset: 0,
	wall_limit: 20,
	wall_is_empty: false,

	/**
	* Get the post from DB
	* @return nothing, emit a change
	*/
	getFromDb: function(post_id){
		if( typeof PostsStore._ajax_loading[post_id] != "undefined" ){
			return PostsStore._ajax_loading[post_id];
		}

		PostsStore._ajax_loading[post_id] = new Promise(function(resolve, reject){
			$.ajax({
				url: __SETTINGS["route.posts"] + post_id,
				dataType: "json",
				method: "GET",
				xhrFields: {withCredentials: true},
			}).done(function(data){
				if( data.status == 'ok' && typeof data.post != 'undefined' ) {
					PostsStore._posts[post_id] = {post: data.post};
					delete PostsStore._ajax_loading[post_id];
					return resolve(data.post);
				}
			}).fail(function(err){
				return reject(err);
			});
		});
		return PostsStore._ajax_loading[post_id];
	},

	getOldPosts: function(count, user_id, wall_addr){
		if(  PostsStore._ajax_loading["oldposts"] == true || PostsStore.wall_is_empty == true ){
			return;
		}

		PostsStore._ajax_loading["oldposts"] = true;
		PostsStore.wall_offset += PostsStore.wall_limit;

		//some limit
		if( PostsStore.wall_offset > __SETTINGS['wall_offset_limit'] ){
			return;
		}

		PostsStore.wall_limit = count;
		$.ajax({
			url: wall_addr + "?limit=" + PostsStore.wall_limit + "&offset=" + PostsStore.wall_offset,
			dataType: "json",
			xhrFields: {withCredentials: true},
			success: function(data) {
				if( data.status == 'ok' ) {
					if( data.posts.length == 0){
						PostsStore.wall_is_empty = true;
					}
					data.posts.map(function(post){
						PostsStore._appendposts.push(post);
					});
					delete PostsStore._ajax_loading["oldposts"];
					PostsStore.emitChange();
				}
			}
		});
	},

	getNewPosts: function(){
		if ( this._posts.length > 0 ){
			var pp = this._posts;
			this._posts = [];
			return pp;
		}else{
			return [];
		}
	},

	getRemovedPosts: function(){
		var rp = this._removed_posts;
		this._removed_posts = [];
		return rp;
	},

	getAppendedPosts: function(){
		var ap = this._appendposts;
		this._appendposts = [];
		return ap;
	},

	emitChange: function() {
		this.emit(CHANGE_EVENT);
	},

	addChangeListener: function(callback, initial_wall_posts_count) {
		this._posts = [];
		this._new_posts_history = [];
		this.wall_limit = initial_wall_posts_count;
		this.on(CHANGE_EVENT, callback);
	},

	removeChangeListener: function(callback) {
		this._posts = [];
		this.removeListener(CHANGE_EVENT, callback);
	},

	dispatcherIndex: AppDispatcher.register(function(payload) {
		var post_id = payload.post_id;
		switch(payload.actionType) {
			case PostConstants.POST_CREATE:
				if( PostsStore._new_posts_history.indexOf(post_id) == -1 ){
					PostsStore._new_posts_history.push(post_id);
					PostsStore.getFromDb(post_id).then(function(result){
						PostsStore.emitChange();
					});
				}
				break;

			case PostConstants.POST_REMOVE:
				PostsStore._removed_posts.push(post_id);
				PostsStore.emitChange();
				break;

			case PostConstants.POST_GETOLD:
				PostsStore.getOldPosts(payload.count, payload.user_id, payload.wall_addr);
				break;
		}

		return true; // No errors. Needed by promise in Dispatcher.
	})
});

module.exports = PostsStore;