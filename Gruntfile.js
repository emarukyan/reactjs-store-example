module.exports = function(grunt) {
	var dest_root = '../nodeserver/public';
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		concat: {
			dist: {
				src: ['src/vendors/jquery-1.11.2.min.js',
						'src/vendors/react.js',
						'src/vendors/bootstrap.js',
						'src/vendors/moment.min.js'
						],
				dest: dest_root + '/js-dev/vendors.js',
			}
		},

		watch: {
			react: {
				files: ['src/*.jsx', 'src/*.js', 'src/**/*.jsx', 'src/**/*.js'],
				tasks: ['browserify']
			},
			vendors: {
				files: 'src/vendors/*.js',
				tasks: ['concat']
			},
			scss: {
				files: 'styles/*',
				tasks: ['scss']
			},
			options: {
				livereload: false,
			}
		},

		browserify: {
			options: {
				transform: [ require('grunt-react').browserify ]
				},
				client: {
					src: ['src/main.jsx'],
					dest: dest_root + '/js-dev/main.js'
				}
			},

		minified: {
			files: {
				src: [
					dest_root + '/js-dev/vendors.js',
					dest_root + '/js-dev/main.js'
				],
				dest: dest_root + '/js-prod/'
			},
			options: {
				allinone: true,
				dest_filename: 'frontpage-<%= pkg.version %>.min.js'
			}
		}

	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-minified');


	grunt.registerTask('default', [
		'browserify', 'concat', 'watch'
		]);

	grunt.registerTask('deploy', [
		'browserify', 'concat', 'minified'
		]);
};
