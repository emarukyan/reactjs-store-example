var __SETTINGS = require('../conf.jsx');
var CommentsStore = require('../stores/comments/store');
var CommentActions = require('../stores/comments/actions');
var SingleComment = require('../components/react-singlecomment.jsx');

var PostComments = React.createClass({
	getInitialState: function() {
		return {comments: [], total_comments: 0};
	},

	componentWillMount: function() {
		CommentsStore.addChangeListener(this._onChange);
		CommentsStore.getFromDb(this.props.postid, 100, 0);
	},

	componentWillUnmount: function() {
		CommentsStore.removeChangeListener(this._onChange, this.props.postid);
	},

	_onChange: function(){
		console.log('PostComments:_onChange');
		this.setState( CommentsStore.getComments(this.props.postid, 100) );
	},


	onKeyPress: function(event) {
		if (event.keyCode === 13) {
			event.preventDefault()
			comment_text = event.target.value
			if( comment_text == '' ) { return; }
			var comment_info = {
				post_id: this.props.postid,
				comment: comment_text,
				user_id: __SETTINGS['user'].id};
			this.refs.commentInput.getDOMNode().value = '';

			CommentActions.create(this.props.postid, comment_info);
		}
	},

	render: function(){
		var user_id = this.props.user_id;
		return (
			<div className="post-comments-wrapper">
				<span className="glyphicon glyphicon-comment"></span> Comments ({this.state.total_comments})
				
				{this.state.comments.map(function(comment, i){
					return <SingleComment key={"CommentItem:" + comment.id + ":" + i} comment={comment} user_id={user_id} />;
				})}

				<div className="comment-form">
					<input type="text" placeholder="Reply to comments" onKeyUp={this.onKeyPress} className="form-control" ref="commentInput" />
				</div>
			</div>);
	}
})

module.exports = PostComments;