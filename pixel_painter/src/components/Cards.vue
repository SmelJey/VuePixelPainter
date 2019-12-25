<template>
    <div class="feed">
        <Post v-bind:url="url" v-bind:postAuthor="postAuthor" v-bind:likes="likes"/>
    </div>
</template>

<script>
import Post from './Post.vue'

export default {
    name: 'Cards',
	props: {
			url: String,
			postAuthor: String,
			likes: Number
	},
    components: {
        Post
    }
}
</script>

<style scoped>
@import '../styles/Cards.css';
</style>