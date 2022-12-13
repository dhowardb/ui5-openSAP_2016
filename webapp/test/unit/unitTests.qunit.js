/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"week3/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
