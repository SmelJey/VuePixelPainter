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
    import Axios from 'axios'

    export default {
        methods: {
            goToProfile () {
                if (this.$cookies.get('token') !== null) {
                    let req = '/account/check_token?token=' + this.$cookies.get('token');
                    Axios.get(req)
                        .then((response) => {
                            if (response.data["status"] === "OK") {
                                if (this.$router.currentRoute.fullPath.toLowerCase()
                                    !== '/profile?id=' + this.$cookies.get('login').toLowerCase()) {
                                    this.$router.push('/profile?id=' + this.$cookies.get('login'))
                                }
                            } else {
                                this.$router.push('/auth?cb=' + '/profile');
                            }
                        })
                } else {
                    this.$router.push('/auth?cb=' + '/profile')
                }
            },
            goToRedactor () {
                if (this.$router.currentRoute.name !== 'Painter') {
                    this.$router.push({name: 'Painter'})
                }
            },
            goToHome () {
                if (this.$router.currentRoute.name !== 'Home') {
                    this.$router.push({name: 'Home'})
                }
            },
        }
    }
</script>

<style scoped>
@import '../styles/Nuvbar.css';
</style>