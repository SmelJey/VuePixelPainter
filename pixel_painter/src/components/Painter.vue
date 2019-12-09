<template>
	<div class="pixel-painter is-centered columns" id="pixel-painter">
		<canvas class="box" width="16" height="16" id="canvas" v-on:mousedown="handleMouseDown"
				v-on:mouseup="handleMouseUp" v-on:mousemove="handleMouseMove">

		</canvas>
	</div>
</template>

<script>

export default {
	name: 'Painter',

	data : function() {
		return {
			width: 16,
			height: 16,
			defaultColor: "transparent",
			selectedColor: "black",
			pixels: [],
			buttons: [
				{ btnType: "color", color: "black", active: false },
				{ btnType: "color", color: "white", active: false },
				{ btnType: "color", color: "blue", active: false },
				{ btnType: "color", color: "red", active: false },
				{ btnType: "color", color: "yellow", active: false },
				{ btnType: "color", color: "green", active: false },
				{ btnType: "eraser", color: "pink", active: false },
				{ btnType: "clear", color: "pink", active: false }
			],
			mouse: {
				current: {
					x: 0,
					y: 0
				},
				previous: {
					x: 0,
					y: 0
				},
				down: false
			}
		}
	},
	computed: {
		currentMouse: function () {
			var c = document.getElementById("canvas");
			var rect = c.getBoundingClientRect();

			return {
				x: (this.mouse.current.x - rect.left - 20) / 30,
				y: (this.mouse.current.y - rect.top - 20) / 30
			}
		}
	},
	methods: {
		draw: function () {
			if (this.mouse.down ) {
				var c = document.getElementById("canvas");
				console.log(this.currentMouse.x, this.currentMouse.y);

				var ctx = c.getContext("2d");
				ctx.fillStyle = "#FF0000";

				ctx.fillRect(Math.trunc(this.currentMouse.x), Math.trunc(this.currentMouse.y), 1, 1);
			}

		},
		handleMouseDown: function (event) {
			this.mouse.down = true;
			this.mouse.current = {
				x: event.pageX,
				y: event.pageY
			};

			var c = document.getElementById("canvas");
			var ctx = c.getContext("2d");

			ctx.moveTo(this.currentMouse.x, this.currentMouse.y);
			this.draw(event)

		},
		handleMouseUp: function () {
			this.mouse.down = false;
		},
		handleMouseMove: function (event) {
			this.mouse.current = {
				x: event.pageX,
				y: event.pageY
			};

			if (this.currentMouse.x < 0 || this.currentMouse.x > 16
					|| this.currentMouse.y < 0 || this.currentMouse.y > 16)
				this.mouse.down = false;

			this.draw(event)
		}
	},
}
</script>

<style>
	canvas {
		width: 512px;
		height: 512px;
		image-rendering: -moz-crisp-edges;
		image-rendering: -webkit-crisp-edges;
		image-rendering: pixelated;
		image-rendering: crisp-edges;
	}
</style>