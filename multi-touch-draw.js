function MultiTouchDraw(canvas) {
	this.canvas = canvas;
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	this.context = canvas.getContext("2d");
	this.context.lineCap = "round";
	this.context.lineWidth = 20;

	this.ballpoints = {};
	this.counter = 0;

	canvas.addEventListener("mousedown", (function (e) {
		this.onDrawStart(e);
		canvas.onmousemove = this.onDraw.bind(this);
	}).bind(this));

	canvas.addEventListener("mouseup", (function (e) {
		this.onDrawEnd(e);
		canvas.onmousemove = null;
	}).bind(this));

	canvas.addEventListener("touchstart", (function (e) {
		e.preventDefault();
		for (var i = 0; i < e.changedTouches.length; i++) {
			this.onDrawStart(e.changedTouches[i]);
		}
	}).bind(this));

	canvas.addEventListener("touchmove", (function (e) {
		e.preventDefault();
		for (var i = 0; i < e.changedTouches.length; i++) {
			this.onDraw(e.changedTouches[i]);
		}
	}).bind(this));

	canvas.addEventListener("touchend", (function (e) {
		e.preventDefault();
		for (var i = 0; i < e.changedTouches.length; i++) {
			this.onDrawEnd(e.changedTouches[i]);
		}
	}).bind(this));
}

MultiTouchDraw.randomPastel = function () {
	const h = Math.floor(Math.random() * 360);
	return `hsl(${h}, 90%, 70%)`;
};

MultiTouchDraw.prototype = {
	onDrawStart: function (e) {
		var ballpoint = {
			x: e.pageX - this.canvas.offsetLeft,
			y: e.pageY - this.canvas.offsetTop,
			color: MultiTouchDraw.randomPastel()
		};
		this.ballpoints[e.identifier || ++this.counter] = ballpoint;
		this.drawLine(ballpoint.x - 1, ballpoint.y, ballpoint.x, ballpoint.y, ballpoint.color);
	},

	onDraw: function (e) {
		var ballpoint = this.ballpoints[e.identifier || this.counter],
			x = e.pageX - this.canvas.offsetLeft,
			y = e.pageY - this.canvas.offsetTop;
		this.drawLine(ballpoint.x, ballpoint.y, x, y, ballpoint.color);
		ballpoint.x = x;
		ballpoint.y = y;
	},

	onDrawEnd: function (e) {
		delete this.ballpoints[e.identifier || this.counter];
	},

	drawLine: function (x0, y0, x1, y1, color) {
		this.context.strokeStyle = color;
		this.context.beginPath();
		this.context.moveTo(x0, y0);
		this.context.lineTo(x1, y1);
		this.context.stroke();
	}
};
