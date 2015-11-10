var __SETTINGS = require('../conf.jsx');
var CommentActions = require('../stores/comments/actions');
var React = require('react');
var ReactDOM = require('react-dom');


var SingleComment = React.createClass({
	getInitialState: function(){
		return {style: {}, commentEdit:false };
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

	makeCommentEditable: function(){
		console.log('makeCommentEditable');
		this.setState({commentEdit:true});
	},

	onKeyPress: function(event) {
		if (event.keyCode === 13) {
			event.preventDefault()
			comment_text = event.target.value
			if( comment_text == '' ) { return; }
			var comment_info = {
				id: this.props.comment.id,
				post_id: this.props.comment.post_id,
				comment: comment_text,
				user_id: __SETTINGS['user'].id};
				console.log(this.refs.commentInput);
			CommentActions.update(comment_info, this.props.comment.post_id);
			this.setState({commentEdit: false});
		}
	},

	render: function() {
		var comment = this.props.comment;
		var style = this.state.style;

		var commentValue = comment.comment;

		var removeCommentClass = 'hidden';
		if( this.props.user_id == __SETTINGS['user'].id || comment.user_id == __SETTINGS['user'].id ) {
			removeCommentClass = 'remove-comment';
		}

		//in case commenet is just entered, and we don't yet have id
		if( comment.id == 0 ) {
			removeCommentClass = 'hidden';
			style = {backgroundColor: '#6FD960'};
		}
		// edit button click
		if( this.state.commentEdit === true ) {
			commentValue = (<input id="editInput" defaultValue={comment.comment} onKeyUp={this.onKeyPress} ref={"commentInput"}/>);
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
					{commentValue}
				</div>

				<div className="comment-date">
					{this.formattedTime()}
				</div>
				<div className={removeCommentClass} onClick={this.commentRemoveHandler}>x</div>
				<div className="editComment" onClick={this.makeCommentEditable}>Edit</div>
			</div>
			);
	}
});


module.exports = SingleComment;