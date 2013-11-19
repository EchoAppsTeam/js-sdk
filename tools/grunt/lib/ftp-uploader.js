"use strict";

var Ftp = require("ftp");
var fs = require("fs");
var path = require("path");

var FtpUploader = function(config) {
	this.config = config;
	this.client = new Ftp({
		host: config.auth.host,
		port: config.auth.port,
		connTimeout: 600000 // 10 minutes
	});
};

FtpUploader.prototype.ping = function() {
	var self = this;
	this._connect(function() {
		self._log("FTP connection OK");
		self.stop();
	});
};

FtpUploader.prototype.start = function() {
	var self = this;
	this._connect(function() {
		self.queue = [];
		var processedDirs = {};
		var dirs = [];
		var files = [];
		var recursiveAdd = function(dir) {
			var name = "/";
			var parts = dir.split("/");
			// remove first and last elements because they are empty
			parts.pop();
			parts.shift();
			parts.map(function(n) {
				name += n + "/";
				if (!processedDirs[name]) {
					processedDirs[name] = true;
					dirs.push(name);
				}
			});
		};
		self.config.uploads.map(function(upload) {
			upload.src.sort();
			upload.src.map(function(srcName) {
				var name = srcName.replace(upload.baseSrcPath, "");
				var destName = upload.dest + name;
				files.push({
					"src": srcName,
					"dest": destName
				});
				recursiveAdd(path.dirname(destName) + "/");
			});
		});
		dirs.sort();
		dirs.map(function(dir) {
			self.enqueue("makeDir", dir);
		});
		files.map(function(file) {
			self.enqueue("uploadFile", file);
		});
		self.currentStep = 1;
		self.totalSteps = self.queue.length;
		self._next();
	});
};

FtpUploader.prototype.stop = function(success) {
	this.client.end();
	this.config.complete(success);
};

FtpUploader.prototype.enqueue = function() {
	var args = Array.prototype.slice.call(arguments, 0);
	var name = args.shift();
	this.queue.push(function() {
		this["_" + name].apply(this, args);
	});
};

FtpUploader.prototype._connect = function(callback) {
	var self = this;
	this.client.on("connect", function() {
		self.client.auth(self.config.auth.user, self.config.auth.password, function(err) {
			if (err) {
				self._error(err.message);
				return;
			}
			callback && callback();
		});
	});
	this.client.connect();
};

FtpUploader.prototype._uploadFile = function(file) {
	var self = this;
	this._log(this.currentStep++ + "/" + this.totalSteps + ": " + file.dest);
	if (this.config.debug) {
		this._next();
		return;
	}
	this.client.put(fs.createReadStream(file.src), file.dest, function(err) {
		if (err) {
			self._error(err.message);
		} else {
			self._next();
		}
	});
};

FtpUploader.prototype._makeDir = function(name) {
	var self = this;
	this._log(this.currentStep++ + "/" + this.totalSteps + ": " + name);
	if (this.config.debug) {
		this._next();
		return;
	}
	this.client.mkdir(name, function() {
		self._next();
	});
};

FtpUploader.prototype._next = function() {
	if (!this.queue.length) {
		this.stop();
		return;
	}
	this.queue.shift().call(this);
};

FtpUploader.prototype._log = function(text) {
	var log = this.config.logger && this.config.logger.log || function() {};
	log(text);
};

FtpUploader.prototype._error = function(text) {
	var error = this.config.logger && this.config.logger.error || function() {};
	error(text);
	this.stop(false);
};

module.exports = FtpUploader;
