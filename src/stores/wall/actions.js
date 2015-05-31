var AppDispatcher = require('../../AppDispatcher');
var WallConstants = require('./constants');

var WallActions = {
	check4update: function() {
		AppDispatcher.dispatch({
			actionType: WallConstants.WALL_CHECK4UPDATES
		});
	}
};

module.exports = WallActions;