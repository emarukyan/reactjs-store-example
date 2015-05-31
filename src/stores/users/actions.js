var AppDispatcher = require('../../AppDispatcher');
var UsersConstants = require('./constants');

var UsersActions = {
	user_changed: function(user_id) {
		AppDispatcher.dispatch({
			actionType: UsersConstants.USER_INFO_CHANGED,
			user_id: user_id
		});
	}

};

module.exports = UsersActions;