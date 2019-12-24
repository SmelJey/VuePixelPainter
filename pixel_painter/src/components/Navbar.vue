<template>
    <nav>
        <div class="content">
            <a><img @click="goToHome()" src="../assets/main_logo.png"></a>
            <div class="links">
                <a><img @click="goToRedactor()" src="../assets/icons/pen_icon.png"></a>
                <a><img @click="goToProfile()" src="../assets/icons/people_icon.png"></a>
            </div>
        </div>
    </nav>
</template>

<script>
export default {
    methods: {
        goToProfile () {
            console.log(this.$cookies.get('token'));
            if (this.$cookies.get('token').length === 32){
                this.$router.push({name: 'Profile'})
            }
        },
        goToRedactor () {
            this.$router.push({name: 'Painter'})
        },
        goToHome () {
            this.$router.push({name: ''})
        },
    }
}
</script>

<style scoped>
@import '../styles/Nuvbar.css';
</style>