/*
 * Metadata - jQuery countdown plugin
 * http://alexmuz.ru/jquery-countdown/
 *
 * Copyright (c) 2009 Alexander Muzychenko
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */

$.fn.countdown = function (date, options) {
	options = $.extend({
		lang: {
			years:   ['year', 'years'],
			months:  ['month', 'months'],
			days:    ['day', 'days'],
			hours:   ['hour', 'hours'],
			minutes: ['minute', 'minutes'],
			seconds: ['second', 'seconds'],
			plurar:  function(n) {
				return (n == 1 ? 0 : 1);
			}
		},
		prefix: "",
		display: "full", // full | compact
		finish: null
	}, options);

	var timeDifference = function(begin, end) {
		if (end.getTime() < begin.getTime()) {
			return false;
		}
		if (options.display == "full") {
			var diff = [
				["seconds", end.getSeconds() - begin.getSeconds(), 60],
				["minutes", end.getMinutes() - begin.getMinutes(), 60],
				["hours", end.getHours() - begin.getHours(), 24],
				["days", end.getDate() - begin.getDate(), new Date(begin.getFullYear(), begin.getMonth() + 1, 0).getDate()],
				["months", end.getMonth() - begin.getMonth(), 12],
				["years", end.getFullYear() - begin.getFullYear(), 0]
			];
			var result = [];
			var flag = false;
			$.each(diff, function(i, a) {
				if (flag) {
					a[1]--;
					flag = false;
				}
				if (a[1] < 0) {
					flag = true;
					a[1] += a[2];
				}
				if (!a[1] && a[0] != "seconds") return;
				result.push(a[1] + ' ' + options.lang[a[0]][options.lang.plurar(a[1])]);
			});
			return result.reverse().join(' ');
		} else {
			var diff = Math.floor((end.getTime() - begin.getTime()) / 1000);
			var dayDiff = Math.floor(diff / 86400);
			var when = "";
			var display = function(diff, period) {
				return diff + " " + period + (diff == 1 ? "" : "s");
			};
			if (diff < 60) {
				when = display(diff, "second");
			} else if (diff < 60 * 60) {
				diff = Math.floor(diff / 60);
				when = display(diff, "minute");
			} else if (diff < 60 * 60 * 24) {
				diff = Math.floor(diff / (60 * 60));
				when = display(diff, "hour");
			} else if (dayDiff < 30) {
				when = display(dayDiff, "day");
			} else if (dayDiff < 365) {
				diff =  Math.floor(dayDiff / 31);
				when = display(diff, "month");
			} else {
				when = "more than year";
			}
			return when;
		}
	};
	var elem = $(this);
	var timeUpdate = function () {
		var s = timeDifference(new Date, date);
		if (s.length) {
			elem.html(options.prefix + s);
		} else {
			options.finish && options.finish();
			clearInterval(timer);
		}
	};
	timeUpdate();
	var timer = setInterval(timeUpdate, 1000);
};
