var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var AppDispatcher = require('../../AppDispatcher');
var __SETTINGS = require('../../conf.jsx');
var WallConstants = require('./constants');

var ACTION_EVENT = 'action';


var WallStore = assign({}, EventEmitter.prototype, {
	emitAction: function() {
		this.emit(ACTION_EVENT);
	},

	addActionListener: function(callback) {
		this.on(ACTION_EVENT, callback);
	},

	removeActionListener: function(callback) {
		this.removeListener(ACTION_EVENT, callback);
	},

	dispatcherIndex: AppDispatcher.register(function(payload) {
		switch(payload.actionType) {
			case WallConstants.WALL_CHECK4UPDATES:
				WallStore.emitAction();
				break;
		}

		return true; // No errors. Needed by promise in Dispatcher.
	})
});

module.exports = WallStore;