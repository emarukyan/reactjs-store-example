var __SETTINGS = [];

var __REST_api_host = 'http://localhost:3000';
var __SOCKET_host = __REST_api_host;
var __REST_api_path = __REST_api_host + '';
var __REST_api_version = '';


__SETTINGS['upload_max_file_size'] = 500*1024;
__SETTINGS['allowed_photo_extensions'] = ['image/jpg', 'image/jpeg', 'image/gif', 'image/png'];

__SETTINGS['post_comments_initial_quantity'] = 3;
__SETTINGS['route.posts'] = __REST_api_path + __REST_api_version + '/posts/';
__SETTINGS['route.walls'] = __REST_api_path + __REST_api_version + '/walls/';
__SETTINGS['route.comments'] = __REST_api_path + __REST_api_version + '/comments/';
__SETTINGS['route.users'] = __REST_api_path + __REST_api_version + '/users/';
__SETTINGS['route.interests'] = __REST_api_path + __REST_api_version + '/interests/';
__SETTINGS['route.loveinterests'] = __REST_api_path + __REST_api_version + '/loveinterests/';
__SETTINGS['route.thumbs'] = __REST_api_path + __REST_api_version + '/thumbs/';
__SETTINGS['route.upload'] = __REST_api_path + __REST_api_version + '/upload/';
__SETTINGS['route.support'] = __REST_api_path + __REST_api_version + '/support/';
__SETTINGS['route.analytics'] = __REST_api_path + __REST_api_version + '/analytics/';

__SETTINGS['route.socket'] = {};
__SETTINGS['route.socket'].host = __SOCKET_host;
__SETTINGS['route.socket'].path = '/api/' + __REST_api_version + '/socket';

__SETTINGS['wall_offset_limit'] = 100; // how many posts to pull on mouse scroll

__SETTINGS['url_fetcher_api'] = 'http://l.gistcom.com/url';
__SETTINGS['login.url'] = 'http://gistcom.com/site/login';

__SETTINGS['onscroll.wall.posts.pull.count'] = 5;




__SETTINGS['user'] = {
	"id": 1,
	"user_url": "/frontpage/#user/1",
	"user_photo": "https://fppp1.s3.amazonaws.com/2009a410-05f4-11e5-bc8d-45ff6d50e621.jpg",
	"user_name": "Edgar Marukyan",
	"user_peach": "",
	"user_banner_path": "https://fppp1.s3.amazonaws.com/dc374670-05f3-11e5-bc8d-45ff6d50e621.jpg",
	"posting_enabled": false,
	"contacts": {},
	"lastUsedInterest": 0,
	"interests": [],
	"is_new": false
};

module.exports = __SETTINGS;