<template>
    <div class="main">
        <nav>
            <div class="content">
                <img src="../assets/main_logo.png">
                <div class="links">
                    <a><img @click="goToRedactor()" src="../assets/icons/pen_icon.png"></a>
                    <a><img @click="goToProfile()" src="../assets/icons/people_icon.png"></a>
                </div>
            </div>
        </nav> 
        <div class="pixel-painter is-centered columns" id="pixel-painter">
            <div class="column columns is-one-fifth is-multiline is-centered is-gapless">
                <div class="column is-multiline">
                    <button class="button is-fullwidth" v-for="(btn, indx) in getColumn(0, colorButtons)"
                            v-on:click="btn.btnHandle(btn.color)"
                            :key="indx"
                            :style="{'background-color': btn.color}"></button>
                </div>
                <div class="column is-multiline">
                    <button class="button is-fullwidth" v-for="(btn, indx) in getColumn(1, colorButtons)"
                            v-on:click="btn.btnHandle(btn.color)"
                            :key="indx"
                            :style="{'background-color': btn.color}"></button>
                </div>
            </div>
        </div>
		<canvas class="box" width="16" height="16" id="canvas" v-on:mousedown="handleMouseDown"
				v-on:mouseup="handleMouseUp" v-on:mousemove="handleMouseMove">
		</canvas>
        <div class="column columns is-one-fifth is-multiline is-centered is-gapless">
            <div class="column is-multiline">
                <button class="button is-fullwidth" v-for="(btn, indx) in getColumn(0, funcButton)"
                        v-on:click="btn.btnHandle(btn.color)"
                        :key="indx"
                        :style="{'background-color': btn.color}">
                    {{btn.text}}
                </button>
                <button class="button is-fullwidth" v-on:click="showSaver = true">
                    Save
                </button>

            </div>
            <div class="column is-multiline">
                <button class="button is-fullwidth" v-for="(btn, indx) in getColumn(1, funcButton)"
                        v-on:click="btn.btnHandle(btn.color)"
                        :key="indx"
                        :style="{'background-color': btn.color}">
                    {{btn.text}}
                </button>
                <button class="button is-fullwidth" v-on:click="showLoader = true">Load from link</button>
            </div>
        </div>
    </div>
</template>

<script>
    //import Axios from 'axios'
    const Axios = require('axios');
    //import SaverModal from "./SaverModal";

    export default {
        name: 'Painter',
        data : function() {
            return {
                width: 16,
                height: 16,
                defaultColor: "white",
                selectedColor: "black",
                pixels: [],
                showSaver: false,
                showLoader: false,
                loadFromURL: "",
                linkErr: false,
                colorButtons: [
                    { btnHandle: this.selectColor, color: "Red", active: false },
                    { btnHandle: this.selectColor, color: "FireBrick", active: false },
                    { btnHandle: this.selectColor, color: "Green", active: false },
                    { btnHandle: this.selectColor, color: "GreenYellow", active: false },
                    { btnHandle: this.selectColor, color: "Orange", active: false },
                    { btnHandle: this.selectColor, color: "DarkGoldenRod", active: false },
                    { btnHandle: this.selectColor, color: "Yellow", active: false },
                    { btnHandle: this.selectColor, color: "Gold", active: false },
                    { btnHandle: this.selectColor, color: "DodgerBlue", active: false },
                    { btnHandle: this.selectColor, color: "Blue", active: false },
                    { btnHandle: this.selectColor, color: "DarkCyan", active: false },
                    { btnHandle: this.selectColor, color: "DarkTurquoise", active: false },
                    { btnHandle: this.selectColor, color: "Purple", active: false },
                    { btnHandle: this.selectColor, color: "Magenta", active: false },
                    { btnHandle: this.selectColor, color: "Grey", active: false },
                    { btnHandle: this.selectColor, color: "LightGrey", active: false },
                    { btnHandle: this.selectColor, color: "Black", active: false },
                    { btnHandle: this.selectColor, color: "White", active: false }
                ],
                funcButton: [
                    { btnHandle: this.selectColor, color: "White", active: false, text:"Erase" },
                    { btnHandle: this.clear, color: "White", active: false, text:"Clear" },
                    { btnHandle: this.load, color: "White", active: false, text:"Load from gallery" },
                    { btnHandle: this.publish, color: "White", active: false, text:"Publish" },
                    { btnHandle: this.share, color: "White", active: false, text:"Share" }
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
                let c = document.getElementById("canvas");
                let rect = c.getBoundingClientRect();

                return {
                    x: (this.mouse.current.x - rect.left - 20) / 30,
                    y: (this.mouse.current.y - rect.top - 20) / 30
                }
            },
            saveLink: function(){
                let c = document.getElementById("canvas");
                return c.toDataURL()
            }
        },
        methods: {
            getColumn: function(column, container){
                return container.filter((item, indx) => (indx % 2) == column);
            },
            clear: function() {
                let c = document.getElementById("canvas");
                let ctx = c.getContext("2d");
                ctx.fillStyle = "#FFFFFF";
                ctx.fillRect(0, 0, 16, 16);
                ctx.fillStyle = this.selectedColor
            },
            selectColor: function(color) {
                let c = document.getElementById("canvas");
                let ctx = c.getContext("2d");
                this.selectedColor = color;
                ctx.fillStyle = color;
            },
            save: function() {
                let c = document.getElementById('canvas');
                let url = c.toDataURL();
                let label = "test";

                this.showSaver = false;

                Axios.get(url, { responseType: 'blob' })
                    .then(({ data }) => {
                        const blob = new Blob([data], { type: 'image/png' });
                        const link = document.createElement('a');
                        link.href = URL.createObjectURL(blob);
                        link.download = label;
                        link.click()
                    }).catch(error => console.error(error));
            },
            publish: function() {
                let c = document.getElementById('canvas');
                let data = { image: c.toDataURL(), date: Date.now() };

                console.log(JSON.stringify(data));
            },
            loadFromLink : function() {
                testImage(this.loadFromURL, (url, res) => {
                    if (res === "error"){
                        this.linkErr = true;
                        this.showLoader = true;
                    } else {
                        this.linkErr = false;
                        let canvas = document.getElementById("canvas");
                        let ctx = canvas.getContext("2d");

                        let img = new window.Image;
                        img.addEventListener("load", () => {
                            ctx.clearRect(0, 0, canvas.width, canvas.height);
                            ctx.drawImage(img, 0, 0);
                            this.showLoader = false;
                        });

                        img.setAttribute("src", this.loadFromURL);
                    }
                });

            },

            draw: function () {
                if (this.mouse.down ) {
                    let c = document.getElementById("canvas");

                    let ctx = c.getContext("2d");
                    ctx.fillStyle = this.selectedColor;

                    ctx.fillRect(Math.trunc(this.currentMouse.x), Math.trunc(this.currentMouse.y), 1, 1);
                }

            },

            handleMouseDown: function (event) {
                this.mouse.down = true;
                this.mouse.current = {
                    x: event.pageX,
                    y: event.pageY
                };

                let c = document.getElementById("canvas");
                let ctx = c.getContext("2d");

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

    function testImage(url, callback) {
        let img = new Image();
        img.onerror = img.onabort = function() {
            callback(url, "error");
        };
        img.onload = function() {
            callback(url, "success");
        };
        img.src = url;
    }
</script>

<style>
	canvas {
        margin-top: 13px;
		width: 512px;
		height: 512px;
		image-rendering: -moz-crisp-edges;
		image-rendering: -webkit-crisp-edges;
		image-rendering: pixelated;
		image-rendering: crisp-edges;
    }
    @import '../css/Nuvbar.css';
</style>