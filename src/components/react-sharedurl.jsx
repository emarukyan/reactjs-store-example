var React = require('react');


var SharedUrl = React.createClass({
	getInitialState: function(){
		if( !this.props.urldata || !this.props.urldata.url ) {
			return {};
		}

		var is_embed = false;
		var sharedMedia = <img src={this.props.urldata.media_path} />;
		var url = this.props.urldata.url
		if( url ) {
			try {
				var embedMedia = testUrlForEmbeddableMedia(url);
			}catch(e){
				
			}
			if( embedMedia != null ) {
				var t = getEmbedMediaIframe(embedMedia, 489, 280);
				if( t ) {
					var sharedMedia = t;
					is_embed = true;
				}
			}
		}
		return {sharedMedia: sharedMedia, is_embed: is_embed};
	},

	sharedUrlClick: function(){
		if( this.props.sharedUrlClick ) {
			this.props.sharedUrlClick();
		}
	},

	render: function() {
		var sharedMediaClass = 'urlthumbnail';
		var photoPath = this.state.sharedMedia;
		if ( typeof this.props.customPhoto != "undefined" ){
			photoPath = (<img src={this.props.customPhoto} />);
		}

		if( !this.props.urldata || !this.props.urldata.url ) {
			return (<div></div>);
		}else{
			return (
				<a className="clearfix post-link" href={this.props.urldata.url} ref="shared-url" target="_blank" onClick={this.sharedUrlClick}>
					<div className={sharedMediaClass}>
						{photoPath}
					</div>
					<div hidden={this.state.is_embed}>
						<div className="title">{this.props.urldata.title}</div>
						<div className="description">{this.props.urldata.description}</div>
						<div className="url">{this.props.urldata.url}</div>
					</div>
				</a>);
		}
	}
});


function getEmbedMediaIframe(media, width, height){
	width = width || 523;
	height = height || 300;

	switch( media.type ) {
		case 'youtube':
			var url = 'https://www.youtube.com/embed/' + media.id + '?rel=0&amp;showinfo=0';
			//return (<div>Youtube Iframe Placeholder</div>);
			return (<iframe width={width} height={height} src={url} frameBorder="0" allowFullScreen></iframe>);
		case 'vimeo':
			var url = 'https://player.vimeo.com/video/' + media.id;
			//return (<div>Vimeo Iframe Placeholder</div>);
			return (<iframe width={width} height={height} src={url} frameBorder="0" webkitallowfullscreen mozallowfullscreen allowFullScreen></iframe>);
	}
}

function testUrlForEmbeddableMedia(url) {
	var success = false;
	var media   = {};
	if( typeof url == "undefined" || url == "" ) {
		return null;
	}
	if (url.match('http(s)?://(www.)?youtube|youtu\.be')) {
		if (url.match('embed')) { youtube_id = url.split(/embed\//)[1].split('"')[0]; }
		else { youtube_id = url.split(/v\/|v=|youtu\.be\//)[1].split(/[?&]/)[0]; }
		media.type  = "youtube";
		media.id    = youtube_id;
		success = true;
	}
	else if (url.match('https://(player.)?vimeo\.com')) {
		vimeo_id = url.split(/video\/|http(s)?:\/\/vimeo\.com\//)[2].split(/[?&]/)[0];
		media.type  = "vimeo";
		media.id    = vimeo_id;
		success = true;
	}
	else if (url.match('http://player\.soundcloud\.com')) {
		soundcloud_url = unescape(url.split(/value="/)[1].split(/["]/)[0]);
		soundcloud_id = soundcloud_url.split(/tracks\//)[1].split(/[&"]/)[0];
		media.type  = "soundcloud";
		media.id    = soundcloud_id;
		success = true;
	}

	if ( success ) {
		return media;
	}else {
		return null;
	}
	return null;
}


//function youtube_parser(url){
//    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
//    var match = url.match(regExp);
//    if (match&&match[7].length==11){
//        return match[7];
//    }else{
//        return null;
//    }
//}


module.exports = SharedUrl;