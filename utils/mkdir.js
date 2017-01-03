const mkdirp = require('mkdirp');

function mkdir(dir, opts) {
	return new Promise(function(resolve, reject) {
		mkdirp(dir, opts, (err, made) => {
			if (err) {
				reject(err);
			} else {
				resolve(made);
			}
		});
	});
}

module.exports = mkdir;