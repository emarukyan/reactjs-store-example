var __SETTINGS =  require('../conf.jsx');
var React = require('react');
var Wall = require('../components/react-wall.jsx');

var PageHome = React.createClass({
	render: function() {
		if( typeof __SETTINGS['user'].id == "undefined" ) {
			//document.location = __SETTINGS['login.url'];
			return (<div />);
		}
		return (
			<div className="row">
				<div className="col-md-6 col-sx-8 col-sx-offset-2 col-sm-8 col-sm-offset-1 col-md-offset-3 timeline">
					<Wall
						key={"TimeLineWall:" + __SETTINGS['user'].id}
						user_id={__SETTINGS['user'].id}
						getWallAddr={__SETTINGS['route.walls'] + __SETTINGS['user'].id}
						timeline={true}
					 />
				</div>
			</div>
			);
	}
});

module.exports = PageHome;