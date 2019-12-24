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
            if (this.$cookies.get('token') !== null) {
                if (this.$router.currentRoute.name !== 'Profile') {
                    this.$router.push({name: 'Profile'})
                }
            } else {
                this.$router.push({name: 'Auth'})
            }
        },
        goToRedactor () {
            if (this.$router.currentRoute.name !== 'Painter') {
                this.$router.push({name: 'Painter'})
            }
        },
        goToHome () {
            if (this.$router.currentRoute.name !== 'Home') {
                this.$router.push({name: ''})
            }
        },
    }
}
</script>

<style scoped>
@import '../styles/Nuvbar.css';
</style>