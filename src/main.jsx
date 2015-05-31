var Router = require('react-router-component');

var Locations = Router.Locations;
var Location = Router.Location;

var __SETTINGS	= require('./conf.jsx');
var NotFound = Router.NotFound;

var PageHome = require('./pages/home.jsx');
var PagePost = require('./pages/post.jsx');
var NotFoundPage = require('./pages/notfound.jsx');


var App = React.createClass({
	getInitialState: function() {
		return {Progress: (<div></div>)};
	},
	showProgressBar: function() {
		var style = {width: "20%"};
		var Progress = (<div><p>&nbsp;</p>
							<div className="progress">
								<div className="progress-bar progress-bar-info progress-bar-striped" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100" style={style}></div>
							</div>
						</div>);
		this.setState({Progress: Progress});
	},

	hideProgressBar: function() {
		this.setState({Progress: (<div></div>)});
	},

	render: function() {
		return (
			<div>
				{this.state.Progress}
				<Locations hash onBeforeNavigation={this.showProgressBar} onNavigation={this.hideProgressBar} >
					<Location path="/" handler={PageHome} />
					<Location path="/#" handler={PageHome} />

					<Location path="post/:postid" handler={PagePost} />
					<Location path="/post/:postid" handler={PagePost} />
					
					<NotFound handler={NotFoundPage} />
				</Locations>
			</div>
			);
	}
});


React.render(React.createElement(App), document.getElementById('content') );