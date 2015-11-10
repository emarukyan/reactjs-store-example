var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var AppDispatcher = require('../../AppDispatcher');
var __SETTINGS = require('../../conf.jsx');
var CommentsConstants = require('./constants');


var CHANGE_EVENT = 'change';

EventEmitter.defaultMaxListeners = 1000;
var CommentsStore = assign({}, EventEmitter.prototype, {
	_comments: [],
	_ajax_loading: [],


	/**
	* Get the post comments from DB
	* @return nothing, emit a change
	*/
	getFromDb: function(post_id, limit, offset){
		limit = limit || 1000;
		offset = offset || 0;
		if( CommentsStore._ajax_loading[post_id] == true ){
			return;
		}

		CommentsStore._ajax_loading[post_id] = true;
		$.ajax({
			url: __SETTINGS["route.comments"] + "?offset=" + offset + "&limit=" + limit + "&post_id=" + post_id
				+ "&orderBy=createdAt&order=desc",
			dataType: "json",
			method: "GET",
			xhrFields: {withCredentials: true},
			success: function(data){
				if( data.status == 'ok' && typeof data.comments != 'undefined' ) {
					CommentsStore._comments[post_id] = {comments: data.comments, total_comments: data.total_comments};
					delete CommentsStore._ajax_loading[post_id];
					CommentsStore.emitChange();
				}
			}
		});
	},

	/**
	* Get the post comments from local storage.
	* @return {object}
	*/
	getComments: function(post_id, limit, offset) {
		//if we have any cache (even invalid, give that one)
		if( this._comments[post_id] ){
			return this._comments[post_id];
		}else{
			//send empty state, untill ajax pulls real comments from server.
			return {comments: [], total_comments: 0};	
		}
	},

	addNew: function(post_id, comment_info){
		console.log('addNew');
		this.addEnteredComment(post_id, comment_info);
		return new Promise(function(resolve, reject){
			$.ajax({
				url: __SETTINGS['route.comments'],
				dataType: "json",
				data: comment_info,
				method: "POST",
				xhrFields: {withCredentials: true},
			}).done(function(){
				resolve();
			}).fail(function(){
				reject();
			});
		});
	},

	addEnteredComment: function(post_id, comment_info){
		console.log('addEnteredComment');
		var user_info = __SETTINGS['user'];
		var comment = {
			"id": 0,
			"post_id": post_id,
			"user_id": comment_info.user_id,
			"comment": comment_info.comment,
			"status": 1,
			"user_info": user_info,
			"value_date": Math.floor(Date.now() / 1000)
		};
		this._comments[post_id].comments.push(comment);
		this._comments[post_id].total_comments++;
		CommentsStore.emitChange();
	},

	removeComment: function(comment_id, post_id){
		return new Promise(function(resolve, reject){
			$.ajax({
				url: __SETTINGS['route.comments'] + comment_id + "?httpMethod=DELETE",
				dataType: "json",
				data: {post_id: post_id},
				xhrFields: {withCredentials: true}
			}).done(function(){
				resolve();
			}).fail(function(){
				reject();
			});
		});
	},

	updateComment: function(post_id, comment_info){
		console.log('Update');
		this.updatedExistingComment(post_id, comment_info);
		return new Promise(function(resolve, reject){
			$.ajax({
				url: __SETTINGS['route.comments'],
				dataType: "json",
				data: comment_info,
				method: "PUT",
				xhrFields: {withCredentials: true},
			}).done(function(){
				resolve();
			}).fail(function(){
				reject();
			});
		});
	},

	updatedExistingComment: function(post_id, comment_info){
		console.log('updateExistingComment');
		console.log(comment_info);
		console.log('*************');
		var user_info = __SETTINGS['user'];
		var comment = {
			"id": comment_info.id,
			"post_id": post_id,
			"user_id": comment_info.user_id,
			"comment": comment_info.comment,
			"status": 1,
			"user_info": user_info,
			"value_date": Math.floor(Date.now() / 1000)
		};
		console.log(comment.comment);
		console.log('#######################');
		console.log(this._comments[post_id].comments);
		var commentsArray = this._comments[post_id].comments;
		for (var i = 0; i < commentsArray.length; i++) {
			if (commentsArray[i].id == comment.id) {
				commentsArray[i].comment = comment.comment;
			break;
			};
		};
		CommentsStore.emitChange();
	},



	emitChange: function() {
		this.emit(CHANGE_EVENT);
	},

	addChangeListener: function(callback) {
		//this.setMaxListeners(100);
		this.on(CHANGE_EVENT, callback);
	},

	removeChangeListener: function(callback, post_id) {
		delete this._comments[post_id];
		this.removeListener(CHANGE_EVENT, callback);
	},

	dispatcherIndex: AppDispatcher.register(function(payload) {
		switch(payload.actionType) {
			case CommentsConstants.COMMENT_CREATE:
				var post_id = payload.post_id;
				var comment_info = payload.comment_info;
				CommentsStore.addNew(post_id, comment_info).then(function(){
					CommentsStore.getFromDb(post_id);
				});
				break;

			case CommentsConstants.COMMENT_REMOVE:
				var comment_id = payload.comment_id;
				var post_id = payload.post_id;
				CommentsStore.removeComment(comment_id, post_id).then(function(){
					CommentsStore.getFromDb(post_id);
				});
				break;

			case CommentsConstants.COMMENT_UPDATE:
				var comment_info = payload.comment_info;
				var post_id = payload.post_id;
				CommentsStore.updateComment(post_id, comment_info).then(function(){
					CommentsStore.getFromDb(post_id);
				});
				break;

		}

		return true; // No errors. Needed by promise in Dispatcher.
	})
});

module.exports = CommentsStore;