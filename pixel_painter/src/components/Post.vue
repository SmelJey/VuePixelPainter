<template>
    <div class="post">
        <div class="user">
            <div class="min">
                <a><img @click="goToProfile()" src="../assets/test/ava.jpg"/></a>
                <div>
                    <a><p @click="goToProfile()">Andrey</p></a>
                </div>
            </div>
        </div>
        <img src="../assets/test/cat1.jpg"/>
        <div class="title">
            <p>tutu</p>
        </div>
        <div class="deskription">
            <p>1234567890</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Post',
    methods: {
        goToProfile () {
            this.$router.push({name: 'Profile'})
        }
    }
}
</script>

<style scoped>
@import '../styles/Post.css';
</style>