<template>
    <div class="feed">
        <div class="modal is-active" v-show="showModal">
            <div class="modal-background"></div>
            <div class="modal-card">
                <header class="modal-card-head">
                    <button class="button is-small is-rounded edtibutton has-background-grey-lighter" v-on:click="editPic"><i class="fas fa-pencil-alt"></i></button>
                    <p class="modal-card-title specialFont">ART</p>
                    <button class="delete" aria-label="close" v-on:click="closeModal"></button>
                </header>
                <section class="modal-card-body is-paddingless" style="background-color: #f7efed;">
                    <canvas id="modalCanvas" class="is-marginless artImage mobile-canvas" width="16" height="16"/>
                </section>
                <footer v-if="showModal" class="modal-card-foot">
                    <span class="artAuthor" style="font-weight: bold;">Author: </span>
					<span v-on:click="goToProfile()" class="likeAuthor" >
						{{ getOwnerName }}
					</span>
                    <span class="has-text-right mobile-text"> {{ this.imageList[this.modalIndx].likes }}</span>
                    <button class="likebutton" v-on:click="clickLike()">
                        <img v-if="!this.imageList[this.modalIndx].isLiked" src="../assets/icons/black_like.png" height="35px" width="35px"/>
                        <img v-if="this.imageList[this.modalIndx].isLiked" src="../assets/icons/fill_like.png" height="35px" width="35px"/>
                    </button>
                </footer>
            </div>
        </div>
		<Post v-for="(card, indx) in getImages"
			:key="card.innerId"
			:art-id="card.id"
			:author-name="card.owner"
			:url="card.url"
			:likes="card.likes"
			:is-liked="card.isLiked"
			:is-req="isRequired"
			v-on:like="updateImages()"
			v-on:picClick="pictureClick(indx)">
		</Post>
		<div style="width: 100%" v-show="showLoadButton">
			<button class="button is-rounded" v-on:click="requestImages">
				<i class="fas fa-angle-down"></i>
			</button>
		</div>
    </div>
    
</template>

<script>
    import Post from './Post.vue'
    import Axios from 'axios'

    export default {
        name: 'Cards',
        props: {
            request: String
        },
        components: {
            Post
        },
        data: function () {
            return {
                offset: 0,
                numberOfPic: 50,
                requestedNumberPictures: 0,
                loadedPic: 0,
                imageList: [],
                isRequired: false,
                showModal: false,
                showLoadButton: true,
                modalIndx: -1
            }
        },
        computed: {
            getImages() {
                if (!this.isRequired) {
                    this.requestImages();
                }
                return this.imageList
            },
            getOwnerName() {
                if (this.imageList[this.modalIndx].owner.length > 16) {
                    return this.imageList[this.modalIndx].owner.substr(0, 16) + '...';
                }
                return this.imageList[this.modalIndx].owner;
            }
        },
        methods: {
            editPic() {
                let canvas = document.getElementById("modalCanvas");
                localStorage.setItem('painterData', canvas.toDataURL());
                this.$router.push({ name: 'Painter' });
            },
            goToProfile() {
                if (this.$router.currentRoute.fullPath !== '/profile?id=' + this.imageList[this.modalIndx].owner)
                    this.$router.push('/profile?id=' + this.imageList[this.modalIndx].owner);
            },
            clickLike() {
                let operation = '/add?';
                if (this.imageList[this.modalIndx].isLiked)
                    operation = '/remove?';
                let req = '/likes' + operation + 'art_id=' + this.imageList[this.modalIndx].id + '&token=' + this.$cookies.get('token');
                Axios.post(req)
                    .then((response) => {
                        if (response.data['status'] === 'INVALID_TOKEN') {
                            this.$router.push('/auth?cb=' + this.$router.currentRoute.fullPath);
                        }
                        this.updateImages()
                    })
            },
            pictureClick(indx) {
                this.showModal = true;
                this.modalIndx = indx;

                let canvas = document.getElementById("modalCanvas");
                let ctx = canvas.getContext("2d");

                let img = new window.Image;
                img.addEventListener("load", () => {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0);
                });

                img.setAttribute("src", this.imageList[this.modalIndx].url);
            },
            proceedResponse(response) {
                let list = [];
                for (let i = 0; i < response.data["items"].length; ++i) {
                    list.push({
                        id: response.data["items"][i].art_id,
                        url: response.data["items"][i].data,
                        owner: response.data["items"][i].owner_name,
                        isLiked: response.data['items'][i].tokenLikedIt,
                        likes: response.data['items'][i].likes,
                        innerId: response.data['items'][i].art_id + response.data['items'][i].likes * 10000
                    });
                }
                return list;
            },
            closeModal() {
                this.showModal = false;
            },
            updateImages() {
                this.$emit('like');
                let req = '/gallery' + this.request +'&offset=0' + '&count=' + this.requestedNumberPictures;
                Axios.post(req)
                    .then((response) => {
                        if (response.data["status"] === "OK") {
                            let list = this.proceedResponse(response);
                            this.loadedPic = response.data["items"].length;
                            this.imageList = list;
                            this.imageList.sort((a, b) => b.id - a.id);
                        } else {
                            this.$router.push('/auth?cb=' + this.$router.currentRoute.fullPath);
                        }
                    })
                    .catch(() => {
                        this.isRequired = false;
                    });
                this.isRequired = true;
            },
            requestImages() {
                let req = '/gallery' + this.request + '&offset=' + this.offset + '&count=' + this.numberOfPic;
                Axios.post(req)
                    .then((response) => {
                        if (response.data["status"] === "OK") {
                            let list = this.proceedResponse(response);
                            this.loadedPic = response.data["items"].length;
                            this.requestedNumberPictures += this.loadedPic;
							if (this.loadedPic != this.numberOfPic) {
								this.showLoadButton = false;
							}
                            this.offset += this.loadedPic;

                            this.imageList.push.apply(this.imageList, list);
                            this.imageList.sort((a, b) => b.id - a.id);
                        } else {
                            this.$router.push('/auth?cb=' + this.$router.currentRoute.fullPath);
                        }
                    })
                    .catch(() => {
                        this.isRequired = false;
                    });
                this.isRequired = true;
            }
        },
    }
</script>

<style scoped>
@import '../styles/Cards.css';



.modal-card-head {
    background-color: white;
    height: 50px;
}

.modal-card-head p {
    color: #1f1547;
}

.modal-card-foot {
    background-color: white;
    height: 60px;
}

.modal-card-foot span {
    color: #1f1547;
}

.artAuthor {
    font-family: "PixelFont";
    font-size: 30px;
}

.has-text-right {
    margin-bottom: 4px;
    margin-right: 3px;
    font-size: 20px;
    font-weight: bold;
}

.likeAuthor {
    font-family: "Bookman";
    font-size: 30px;
    margin-bottom: 5px;
    width: 100%;
}

.likeAuthor p {
    float: left;
    margin-left: 30px;
    margin-top: 8px;
}

.likebutton {
    padding: 0;
    border: none;
    background: none;
    outline: none;
    margin-left: 5px;
}

.edtibutton {
    margin-top: 10px;
    margin-right: 10px;
}

.artImage {
	width: 100%;
	height: 100%;
}


@media screen and (max-width: 768px), print {
    .modal-card-head {
        background-color: white;
        height: 40px;
    }

    .modal-card-foot {
        background-color: white;
        height: 50px;
    }

    .has-text-right.mobile-text {
        margin-bottom: 2px;
        margin-right: 3px;
        font-size: 18px;
        font-weight: bold;
    }

    .artAuthor {
        font-family: "PixelFont";
        font-size: large;
        margin-bottom: 3px;
    }

    .likeAuthor {
        font-family: "Bookman";
        font-size: large;
        width: 100%;
    }

    .likeAuthor p {
		float: left;
		margin-left: 30px;
		margin-top: 3px;
    }

	.artImage.mobile-canvas {
		width: 80%;
		height: 80%;
    }
}
</style>