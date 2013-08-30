$(document).ready(function() {
	var canvas = document.getElementById("canvas"),
		context = canvas.getContext("2d"),
		offset = $(canvas).offset(),
		mobileDevice = (window.ondevicemotion === null); // Would be undefined on other devices, not null
	
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	
	context.font = "bold 16px Arial";
	context.lineCap = "round";
	context.lineWidth = 20;
	
	var lines = {};
	
	var drawLine = function(line, x, y) {
		context.strokeStyle = line.color;
		context.beginPath();
		context.moveTo(line.x, line.y);
		context.lineTo(x, y);
		context.stroke();
			
		line.x = x;
		line.y = y;
	};
	
	canvas.ontouchstart = function(e) {
		e.preventDefault();
		
		for (var i = 0; i < e.changedTouches.length; i++) {
			var touch = e.changedTouches[i],
				line = {
					x: touch.pageX - offset.left,
					y: touch.pageY - offset.top,
					color: randomPastel()
				};
			lines[touch.identifier] = line;
			
			drawLine(line, line.x - 1, line.y);
		}
	};
	
	canvas.ontouchmove = function(e) {
		e.preventDefault();
		for (var i = 0; i < e.changedTouches.length; i++) {
			var touch = e.changedTouches[i],
				line = lines[touch.identifier],
				x = touch.pageX - offset.left,
				y = touch.pageY - offset.top;
			
			drawLine(line, x, y);
		}
	};
	
	canvas.ontouchend = function(e) {
		e.preventDefault();
		
		for (var i = 0; i < e.changedTouches.length; i++) {
			var touch = e.changedTouches[i];
			delete lines[touch.identifier];
		}
	};
	
	//////////////////////////////////////////////////////////
	// Code to enable mouse events to be treated as touches //
	//////////////////////////////////////////////////////////
	
	var counter = 0;
	var wrapMouseEvent = function(e) {
		e.changedTouches = [{
			pageX: e.pageX,
			pageY: e.pageY,
			identifier: counter
		}];
	};
	
	canvas.onmousedown = function(e) {
		counter++;
		wrapMouseEvent(e);
		canvas.ontouchstart(e);
		
		canvas.onmousemove = function(e) {
			wrapMouseEvent(e);
			canvas.ontouchmove(e);
		};
	};
	
	canvas.onmouseup = function(e) {
		wrapMouseEvent(e)
		canvas.ontouchend(e);
		canvas.onmousemove = null;
	};
});

var randomPastel = function() {
	var r = Math.floor(Math.random() * 4 + 1) * 64,
		g = Math.floor(Math.random() * 4 + 1) * 64,
		b = Math.floor(Math.random() * 4 + 1) * 64;
	return "rgb(" + r + ", " + g + ", " + b + ")";
};