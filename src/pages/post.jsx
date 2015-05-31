var __SETTINGS =  require('../conf.jsx');
var WallPost	= require('../components/react-wallpost.jsx');
var PostsStore  = require('../stores/posts/store');

var PagePost = React.createClass({
	getInitialState: function(){
		return {
			post: {},
			post_populated: false
		};
	},

	componentWillMount: function(){
		var that = this;
		PostsStore.getFromDb(this.props.postid).then(function(post){
			that.setState({post: post, post_populated: true});
		});
	},

	render: function() {
		if( typeof __SETTINGS['user'].id == "undefined" ) {
			document.location = __SETTINGS['login.url'];
			return (<div />);
		}
		if( this.state.post_populated == false ){
			return (<div><p>&nbsp;</p> <p className="alert alert-info">Loading ...</p></div>);
		}

		return (
			<div className="row">
				<div className="col-md-6 col-sx-8 col-sx-offset-2 col-sm-6">
					<WallPost key={"post:" + this.state.post.id}
						post={this.state.post} fullPost={true} />
				</div>
								<div className="col-md-6 col-sx-8 col-sx-offset-2 col-sm-6">
					<WallPost key={"post:" + this.state.post.id + ":32233d"}
						post={this.state.post} fullPost={true} />
				</div>
				
			</div>
		);
	}
});

module.exports = PagePost;