var AppDispatcher = require('../../AppDispatcher');
var CommentsConstants = require('./constants');

var CommentActions = {
	create: function(post_id, comment_info) {
		console.log("Dispatcher: New Comments");
		AppDispatcher.dispatch({
			actionType: CommentsConstants.COMMENT_CREATE,
			post_id: post_id,
			comment_info: comment_info
		});
	},

	remove: function(comment_id, post_id) {
		AppDispatcher.dispatch({
			actionType: CommentsConstants.COMMENT_REMOVE,
			comment_id: comment_id,
			post_id: post_id
		});
	},

	update: function (comment_info, post_id){
		AppDispatcher.dispatch({
			actionType: CommentsConstants.COMMENT_UPDATE,
			comment_info: comment_info,
			post_id: post_id
		});
	}
};

module.exports = CommentActions;