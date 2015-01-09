module.exports = function (grunt) {

	grunt.registerMultiTask('build', 'Build TouchTheBeat as plain web app or Phonegap/Cordova App', function () {
		grunt.log.writeln('Building for target: ' + this.target);
		var subTaskList = this.data;
		for (var taskIndex in subTaskList) {
			var subTask = subTaskList[taskIndex]
			if (typeof subTask === 'string') {
				grunt.task.run(subTask);
			}
		}
	});


};
