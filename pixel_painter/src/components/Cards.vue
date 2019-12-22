<template>
    <div class="feed">
        <Post/>
    </div>
</template>

<script>
import Post from './Post.vue'

export default {
    name: 'Cards',
    components: {
        Post
    }
}
</script>

<style scoped>
@import '../styles/Cards.css';
</style>