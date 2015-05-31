var __SETTINGS = require('../conf.jsx');
var PostComments = require('../components/react-postcomments.jsx');
var SharedUrl = require('../components/react-sharedurl.jsx');
var PostActions = require('../stores/posts/actions');

var WallPost = React.createClass({
	getInitialState: function(){
		//console.log("WallPost, getInitialState: " + this.props.post);
		return ({
			interestFollow: this.props.post.interestFollow || false,
			showToolTip: false,
			deletePromptVisible: false,
			thumbs: this.props.post.thumbs,
			thumbsInitialCount: this.props.post.thumbs,
			thumbUp: this.props.post.thumbUp
		});
	},

	componentDidMount: function() {
		//ThumbsStore.addChangeListener(this._onChange, this.props.post.id);
	},

	componentWillUnmount: function() {
		//ThumbsStore.removeChangeListener(this._onChange, this.props.post.id);
	},

	_onChange: function(post_id){
	},

	formattedTime: function() {
		var nd = new Date(this.props.post.createdAt*1000);
		var fromNow = moment(nd).fromNow();
		return fromNow;
	},

	render: function(){
		var post = this.props.post;
		if( ! post.id || !post.user_info ) {
			return (<div className="alert alert-danger">Sorry. This content is not available (may be already deleted?).</div>);
		}
		
		var mainPhotoClassName = 'hidden';
		if( typeof post.media_path != "undefined" > 0 && typeof post.urldata == "undefined" ){
		 	mainPhotoClassName = 'post-mainphoto';
		}

		var post_permalink = "#post/" + post.id;

		if (this.state.deletePromptVisible) {
			return (
				<div className="alert alert-danger" onDismiss={this.handleAlertDismiss}>
					<h4>Are you sure you want to delete this post?</h4>
					<p>
						<span className="btn btn-danger" onClick={this.postDelete}>Yes delete</span> &nbsp;
						<span className="btn btn-default" onClick={this.handleDeleteAlertDismiss}>Cancel</span>
					</p>
				</div>
			);
		}



		return(
			<div className="clearfix wall-post" data-postid={post.id}>
				<div className="post-maindiv">
					<div className="row post-topinfo">
						<div className="post-author">
							<a href={post.user_info.user_url}>
								<span className="post-userphoto">
									<img src={post.user_info.user_photo} className={post.user_photo == '' ? 'hidden' : ''} />
								</span>
							</a>
							<a href={post.user_info.user_url}>
								<b>{post.user_info.user_name} </b>
							</a>
							has shared a <a href={post_permalink} className="text-info"> {post.post_type} <span className="glyphicon glyphicon-link"></span></a>
						</div>
					</div>

					<div className="post-content">
						{this.props.post.content}
					</div>

					<div className={mainPhotoClassName}>
						<img src={post.media_path} />
					</div>
					<SharedUrl key={"SharedUrl" + post.id}
						urldata={post.urldata}
						customPhoto={post.media_path} />

					<PostComments key={"PostComments:" + post.id}
						postid={post.id}
						user_id={post.user_id}
						allComments={this.props.fullPost} />
				</div>
			</div>
		)
	}
});


module.exports = WallPost;