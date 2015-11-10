var __SETTINGS = require('../conf.jsx');
var React = require('react');
var ReactDOM = require('react-dom');
var WallPost = require('../components/react-wallpost.jsx');
var PostActions = require('../stores/posts/actions');
var WallStore = require('../stores/wall/store');
var PostsStore = require('../stores/posts/store');

var Wall = React.createClass({
	getInitialState: function() {
		return {
			posts: [],
			renderedPosts: [],
			ajax_in_action: false,
			wallChanged: false
		}
	},

	getWallFromDB: function(){
		if( this.state.ajax_in_action == true) {
			return;
		}

		this.setState({ajax_in_action: true});
		var that = this;
		$.ajax({
			url: this.props.getWallAddr,
			dataType: "json",
			xhrFields: {withCredentials: true},
			success: function(data) {
				if( data.status == 'ok' ) {
					var new_posts = [];
					data.posts.map(function(p){
						if( that.state.posts.indexOf(p.id) == -1 ){
							new_posts.push(p);
						}
					});
					that.setState({posts: new_posts});
				}else{
					console.log('Error');
					console.log(data);
				}
				that.setState({ajax_in_action: false});
			}
		});
	},

	componentWillMount: function() {
		wall_addr = this.props.getWallAddr;

		PostsStore.addChangeListener(this._onChange, 10);
		WallStore.addActionListener(this._onAction);

		this.getWallFromDB();
	},

	componentWillUnmount: function() {
		PostsStore.removeChangeListener(this._onChange);
		WallStore.removeActionListener(this._onAction);
	},

	_onInterestToggle: function() {
		//update wall only if there was no scroll or other wall update.
		if(this.state.wallChanged == false ){
			this.getWallFromDB();
		}
	},

	_onAction: function(){
		console.log('WallAction:');
		this.getWallFromDB();
	},

	_onChange: function(){
		var statePosts = this.state.posts;

		//get new posts
		var posts = PostsStore.getNewPosts();
		if( posts.length > 0 ){
			posts.map(function(newspost){
				if( statePosts.indexOf(statePosts) == -1 ) {
					statePosts[newspost.post.id] = newspost.post;
				}
			})
		}

		//delete removed posts.
		var posts = PostsStore.getRemovedPosts();
		if( posts.length > 0 ){
			posts.map(function(post_id){
				statePosts.map(function(post){
					if( post.id == post_id ) {
						var index = statePosts.indexOf(post);
						if( index != -1 ) {
							statePosts.splice(index, 1);
						}

					}
				})
			})
		}

		//append to end of the list
		var posts = PostsStore.getAppendedPosts();
		if( posts.length > 0 ){
			statePosts = posts.concat(statePosts);
		}

		this.setState({posts: statePosts, wallChanged: true});
	},

	render: function() {
		var thumbClick = this.thumbClick;
		var posts = this.state.posts;

		if ( posts.length == 0 ){
			if( this.state.ajax_in_action == true ) {
				return (<div className="text-center"><p>&nbsp;</p><p className="alert alert-info">Loading ...</p></div>);
			}else{
				return (<div className="text-center"><p>&nbsp;</p><p className="alert alert-info">No Posts Here.</p></div>);
			}
		}else{
			//reverse posts
			var post_ids = Object.keys(posts);
			post_ids.reverse();
			return (
				<div className="wall-posts-wrapper">
				{post_ids.map(function(post_id) {
					return <WallPost key={"WallPost:" + posts[post_id].id} post={posts[post_id]} fullPost={false} />;
				})}
				</div>);
		}
	}
})


module.exports = Wall;