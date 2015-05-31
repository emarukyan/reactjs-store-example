var Promise = require('es6-promise').Promise;
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var AppDispatcher = require('../../AppDispatcher');
var __SETTINGS = require('../../conf.jsx');
var UsersConstants = require('./constants');


var CHANGE_EVENT = 'change';

EventEmitter.defaultMaxListeners = 1000;
var UsersStore = assign({}, EventEmitter.prototype, {
	_users: [],
	_ajax_loading: [],

	getCurrentUserFromDb: function(){
		var _ajax_loading_const = 'current-user';
		if( typeof UsersStore._ajax_loading[_ajax_loading_const] != "undefined" ){
			return UsersStore._ajax_loading[_ajax_loading_const];
		}

		UsersStore._ajax_loading[_ajax_loading_const] = new Promise(function(resolve, reject){
			$.ajax({
				url: __SETTINGS['route.users'] + 'current',
				xhrFields: {withCredentials: true}

			}).fail(function(err) {
				UsersStore._users['current'] = null;
				resolve(null);

			}).done(function(data){
				if( data.status == 'ok' ) {
					delete UsersStore._ajax_loading[_ajax_loading_const];
					UsersStore._users['current'] = data.user_info;
					__SETTINGS['user'] = data.user_info;
					resolve(data.user_info);
				}else{
					resolve(null);
				}
			});
		});
		return UsersStore._ajax_loading[_ajax_loading_const];
	},

	/**
	* Get the suer from DB
	* @return nothing
	*/
	getUserFromDb: function(user_id){
		var _ajax_loading_const = user_id;
		if( typeof UsersStore._ajax_loading[_ajax_loading_const] != "undefined" ){
			return UsersStore._ajax_loading[_ajax_loading_const];
		}

		UsersStore._ajax_loading[_ajax_loading_const] = new Promise(function(resolve, reject){
			$.ajax({
				url: __SETTINGS['route.users'] + user_id,
				xhrFields: {withCredentials: true}

			}).fail(function(err) {
				reject(err);

			}).done(function(data){
				if( data.status == 'ok' ) {
					delete UsersStore._ajax_loading[_ajax_loading_const];
					UsersStore._users['user_id'] = data.user_info;
					resolve(UsersStore._users['user_id']);
				}else{
					resolve(null);
				}
			});
		});

		return UsersStore._ajax_loading[_ajax_loading_const];
	},

	/**
	* Get the user info (if user_id is missing, return current user)
	* @return {object}
	*/
	getUser: function(user_id) {
		if( typeof user_id == 'undefined' ){
			if( typeof UsersStore._users['current'] == 'undefined' ) {
				return UsersStore.getCurrentUserFromDb();
			}else{
				return Promise.resolve(UsersStore._users['current']);
			}
		}

		//if local cache is empty or invalidated, get new one from DB
		if( typeof this._users[user_id] == 'undefined' ){
			return this.getUserFromDb(user_id);
		}else{
			return Promise.resolve(this._users[user_id]);
		}
	},


	emitChange: function() {
		this.emit(CHANGE_EVENT);
	},

	addChangeListener: function(callback) {
		this.on(CHANGE_EVENT, callback);
	},

	removeChangeListener: function(callback, user_id) {
		this.removeListener(CHANGE_EVENT, callback);
	},

	dispatcherIndex: AppDispatcher.register(function(payload) {
		var user_id = payload.user_id;
		switch(payload.actionType) {
			case UsersConstants.USER_INFO_CHANGED:
			if( typeof payload.user_id != 'undefined' ){
				UsersStore.getUserFromDb(user_id).then(function(){
					UsersStore.emitChange();
				});
			}else{
				UsersStore.getCurrentUserFromDb().then(function(){
					UsersStore.emitChange();
				});
			}
			break;


		}

		return true; // No errors. Needed by promise in Dispatcher.
	})
});

module.exports = UsersStore;