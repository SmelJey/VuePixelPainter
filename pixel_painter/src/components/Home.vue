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
    </div>   
</template>

<script>
export default {
    name: 'Home',
    head: {
        meta: [
            { name: 'viewport', content: 'width=device-width, initial-scale=1' }
        ]
    },
    methods: {
        goToProfile () {
            this.$router.push({name: 'Profile'})
        },
        goToRedactor () {
            this.$router.push({name: 'Painter'})
        }
    }
}
</script>

<style scoped>
    @import '../css/Nuvbar.css';
</style>