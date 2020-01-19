<template>
    <div class="feed">
        <Post/>
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