var __SETTINGS = require('../conf.jsx');
var CommentActions = require('../stores/comments/actions');


var SingleComment = React.createClass({
	getInitialState: function(){
		return {style: {} };
	},

	formattedTime: function(utm) {
		var nd = new Date(this.props.comment.value_date*1000);
		var fromNow = moment(nd).fromNow();
		return fromNow;
	},

	commentRemoveHandler: function() {
		var comment_id = this.props.comment.id;
		this.setState({style: {opacity: 0.4, backgroundColor: '#f00'}});
		CommentActions.remove(comment_id, this.props.comment.post_id);
	},

	render: function() {
		var comment = this.props.comment;
		var style = this.state.style;

		var removeCommentClass = 'hidden';
		if( this.props.user_id == __SETTINGS['user'].id || comment.user_id == __SETTINGS['user'].id ) {
			removeCommentClass = 'remove-comment';
		}

		//in case commenet is just entered, and we don't yet have id
		if( comment.id == 0 ) {
			removeCommentClass = 'hidden';
			style = {backgroundColor: '#6FD960'};
		}

		return (
			<div className="clearfix single-comment" style={style}>
				<div className="userpic">
					<a href={comment.user_info.user_url}>
						<img src={comment.user_info.user_photo} />
					</a>
				</div>
				<div className="comment-text">
					<b><a className="comment-userlink" href={comment.user_info.user_url}>{comment.user_info.user_name}: </a></b>
					{comment.comment}
				</div>
				<div className="comment-date">
					{this.formattedTime()}
				</div>
				<div className={removeCommentClass} onClick={this.commentRemoveHandler}>x</div>
			</div>
			);
	}
});


module.exports = SingleComment;