<template>
    <div class="main">
        <Navbar/>
        <div class ="container is-fullwidth is-centered">
            <div class="pixel-painter is-centered column"  id="pixel-painter">
                <div class="modal is-active" v-if="showSaver">
                    <div class="modal-background"></div>
                    <div class="modal-card">
                        <header class="modal-card-head">
                            <p class="modal-card-title">Save image</p>
                            <button class="delete" aria-label="close" v-on:click="showSaver = false"></button>
                        </header>
                        <section class="modal-card-body">
                            <span>You can use this link for loading in this app</span>
                            <div class="textarea" rows="3" style="word-wrap: break-word;">{{saveLink}}</div>
                        </section>
                        <footer class="modal-card-foot">
                            <button class="button is-success" v-on:click="save">Or download to computer</button>
                        </footer>
                    </div>
                </div>

                <div class="modal is-active" v-if="showLoader">
                    <div class="modal-background"></div>
                    <div class="modal-card">
                        <header class="modal-card-head">
                            <p class="modal-card-title">Load image</p>
                            <button class="delete" aria-label="close" v-on:click="showLoader = false"></button>
                        </header>
                        <section class="modal-card-body">
                            <span>Input your link</span>
                            <div class="notification" v-if="linkErr">
                                <button class="delete"></button>
                                Please input correct link
                            </div>
                            <label>
                                <input class="input" type="text" v-model="loadFromURL">
                            </label>
                        </section>
                        <footer class="modal-card-foot">
                            <button class="button is-success" v-on:click="loadFromLink">Load image</button>
                        </footer>
                    </div>
                </div>
                <div class="field is-multiline is-centered is-gapless">
                    <button class="button" v-for="(btn, indx) in colorButtons"
                            v-on:click="btn.btnHandle(btn.color)"
                            :key="indx"
                            :style="{'background-color': btn.color}"></button>
                </div>
                <div class="columns is-centered is-multiline">
                    <canvas class="box" style="margin: 0 auto; padding: 0;" width="16" height="16" id="canvas" v-on:mousedown="handleMouseDown"
                        v-on:touchstart="handleMouseDown" v-on:touchmove="handleMouseMove" v-on:touchend="handleMouseUp"
                        v-on:mouseup="handleMouseUp" v-on:mousemove="handleMouseMove" v-on:mouseout="handleMouseUp" onload="restorePainter()">
                    </canvas>
                </div>

                <div class="field is-multiline is-centered is-gapless">
                    <button class="button menu-button is-rounded" v-for="(btn, indx) in funcButton"
                            v-on:click="btn.btnHandle(btn.color)"
                            :key="indx"
                            :style="{'background-color': btn.color}">
                            <img v-bind:src="btn.url"/>
                    </button>
                    <button class="button menu-button is-rounded" v-on:click="showSaver = true">
                        <img v-bind:src="this.saveicon"/>
                    </button>
                    <button class="button menu-button is-rounded" v-on:click="showLoader = true">
                        Load from link
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Navbar from './Navbar.vue'
    import Axios from 'axios'

    export default {
        name: 'Painter',
        components: {
            Navbar
        },
        data : function() {
            return {
                saveicon: require('../assets/painter_icons/save_icon.png'),
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
                    { btnHandle: this.eraser, color: "White", active: false, url: require('../assets/painter_icons/erase_icon.png') },
                    { btnHandle: this.clear, color: "White", active: false, url: require('../assets/painter_icons/clear_icon.png') },
                    { btnHandle: this.publish, color: "White", active: false, url: require('../assets/painter_icons/push_icon.png') },
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
                    x: (this.mouse.current.x - rect.left - window.pageXOffset) / (rect.width / 16),
                    y: (this.mouse.current.y - rect.top - window.pageYOffset) / (rect.height / 16)
                }
            },
            saveLink: function(){
                let c = document.getElementById("canvas");
                return c.toDataURL()
            }
        },
        methods: {
            eraser: function() {
                let canvas = document.getElementById("canvas");
                let ctx = canvas.getContext("2d");
                ctx.globalCompositeOperation = "destination-out";
                ctx.strokeStyle = "rgba(255,255,255,1)";
            },
            restorePainter: function() {
                let canvas = document.getElementById("canvas");
                let ctx = canvas.getContext("2d");

                let img = new window.Image;
                img.addEventListener("load", () => {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0);
                    this.showLoader = false;
                });

                img.setAttribute("src", localStorage.getItem('painterData'));
            },
            clear: function() {
                let c = document.getElementById("canvas");
                let ctx = c.getContext("2d");
                ctx.clearRect(0, 0, 16, 16);
                localStorage.setItem('painterData', c.toDataURL());
            },
            selectColor: function(color) {
                let c = document.getElementById("canvas");
                let ctx = c.getContext("2d");
                ctx.globalCompositeOperation = "source-over";
                this.selectedColor = color;
                ctx.fillStyle = color;
            },
            save: function() {
                let c = document.getElementById('canvas');
                let url = c.toDataURL();
                let label = "picture";

                this.showSaver = false;

                Axios.get(url, { responseType: 'blob' })
                    .then(({ data }) => {
                        const blob = new Blob([data], { type: 'image/png' });
                        const link = document.createElement('a');
                        link.href = URL.createObjectURL(blob);
                        link.download = label;
                        link.click()
                    });
            },
            publish: function() {
                let c = document.getElementById('canvas');
                let req = '/gallery/create?data=' + encodeURIComponent(c.toDataURL())
                    + '&is_private=false'
                    + '&token=' + this.$cookies.get('token');
                Axios.post(req)
                    .then((response) => {
                        if (response.data['status'] === 'INVALID_TOKEN'){
                            this.$router.push('/auth?cb=' + this.$router.currentRoute.fullPath);
                        }
                    })
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
                            localStorage.setItem('painterData', canvas.toDataURL())
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

                this.draw(event);
                let c = document.getElementById('canvas');
                localStorage.setItem('painterData', c.toDataURL())
            }
        },
        mounted() {
            this.restorePainter()
        }
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
@import '../styles/Main.css';

.button {
    margin: 5px 5px 10px;
}

.button.menu-button {
    font-size: large;
    margin: 5px;
    height: 70px;
}

.button.menu-button img {
    height: 50px;
    width: 50px;

}

@media only screen and (min-width: 512px) {
    canvas {
        margin-top: 13px;
        width: 512px;
        height: 512px;
        image-rendering: -moz-crisp-edges;
        image-rendering: -webkit-crisp-edges;
        image-rendering: pixelated;
        image-rendering: crisp-edges;
        background-color: #f7efed;
    }
}

@media only screen and (max-width: 512px) {
    canvas {
        margin-top: 13px;
        width: 256px;
        height: 256px;
        image-rendering: -moz-crisp-edges;
        image-rendering: -webkit-crisp-edges;
        image-rendering: pixelated;
        image-rendering: crisp-edges;
        background-color: #f7efed;
    }

    .button.menu-button {
        font-family: "Bookman";
        font-size: small;
        margin: 5px;
    }

    #pixel-painter {
        background-color: #f7efed;
    }
}
</style>