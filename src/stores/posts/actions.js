var AppDispatcher = require('../../AppDispatcher');
var PostConstants = require('./constants');

var PostActions = {
	create: function(post_id) {
		AppDispatcher.dispatch({
			actionType: PostConstants.POST_CREATE,
			post_id: post_id
		});
	},

	remove: function(post_id){
		AppDispatcher.dispatch({
			actionType: PostConstants.POST_REMOVE,
			post_id: post_id
		});
	},

	getOldPosts: function(count, user_id, wall_addr){
		AppDispatcher.dispatch({
			actionType: PostConstants.POST_GETOLD,
			count: count,
			user_id: user_id, 
			wall_addr: wall_addr
		});
	}
};

module.exports = PostActions;