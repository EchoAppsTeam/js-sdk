module.exports = function(grunt) {
	var Ftp = require("ftp");
	var fs = require("fs");
	var _ = grunt.utils._;

	var FtpUploader = function(config) {
		var self = this;
		this.config = config;
		this.client = new Ftp({
			host: config.auth.host,
			port: config.auth.port,
			connTimeout: 600000 // 10 minutes
		});
		this.client.on("connect", function() { self.start(); });
		this.client.connect();
	};

	FtpUploader.prototype.start = function() {
		var self = this;
		this.client.auth(this.config.auth.user, this.config.auth.password, function(err) {
			if (err) {
				self._error(err);
				return;
			}

			self.queue = [];
			_.each(self.config.upload, function(upload) {
				var dir = "";
				// substring(1) because variable starts from slash symbol
				_.each(upload.to.substring(1).split("/"), function(name) {
					dir += "/" + name;
					self.enqueue("makeDir", dir);
				});
				self.enqueueDir("", self.config.rootDir + upload.from, upload.to);
			});
			grunt.verbose.writeln("Starting upload");
			self.currentStep = 1;
			self.totalSteps = self.queue.length;
			self._next();
		});
	}

	FtpUploader.prototype.enqueueDir = function(dir, fromPrefix, toPrefix) {
		var self = this;
		var names = fs.readdirSync(fromPrefix + dir);
		_.each(names, function(name) {
			// skip hidden files
			if (/^\./.test(name)) {
				return;
			}

			name = dir + "/" + name;
			var stats = fs.statSync(fromPrefix + name);
			if (stats.isFile()) {
				self.enqueue("uploadFile", name, fromPrefix, toPrefix);
			} else if (stats.isDirectory()) {
				self.enqueue("makeDir", toPrefix + name);
				self.enqueueDir(name, fromPrefix, toPrefix);
			}
		});
	};

	FtpUploader.prototype.enqueue = function() {
		var args = _.toArray(arguments);
		var name = args.shift();
		this.queue.push(function() {
			this["_" + name].apply(this, args);
		});
	};

	FtpUploader.prototype._uploadFile = function(name, fromPrefix, toPrefix) {
		var self = this;
		this.client.put(fs.createReadStream(fromPrefix + name), toPrefix + name, function(err) {
			self._log(toPrefix + name);
			if (err) {
				self._error(err);
			} else {
				self._next();
			}
		});
	};

	FtpUploader.prototype._makeDir = function(name) {
		var self = this;
		this.client.mkdir(name, function() {
			self._log(name);
			self._next();
		});
	};

	FtpUploader.prototype._next = function() {
		if (!this.queue.length) {
			this.config.complete();
			return;
		}
		this.queue.shift().call(this);
	};

	FtpUploader.prototype._log = function(name) {
		grunt.log.writeln(this.currentStep++ + "/" + this.totalSteps + ": " + name);
	};

	FtpUploader.prototype._error = function(text) {
		grunt.log.error(text);
		this.client.end();
		this.config.complete(false);
	};

	grunt.registerInitTask("release", "Release", function(target) {
		var config = grunt.config("local");
		if (!config || !config.release) {
			grunt.fail.fatal("No configuration for this task.");
		}
		if (!target) {
			grunt.task.run([
				"release:sdk",
				"release:products"
			]);
			return;
		}
		// Tell grunt this task is asynchronous.
		var done = this.async();
		var version = grunt.config("pkg.version");
		var majorVersion = version.split(".")[0];
		switch (target) {
			case "sdk":
			case "sandbox":
				_.each(config.release[target].upload, function(upload) {
					upload.to = upload.to
						.replace("{majorVersion}", majorVersion)
						.replace("{version}", version);
				});
				// no break statement!
			case "products":
				new FtpUploader(_.extend({
					"complete": done,
					"rootDir": grunt.config("dirs.dest") + "/"
				}, config.release[target]));
				break;
		}
	});
};
