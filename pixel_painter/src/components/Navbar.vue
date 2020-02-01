<template>
    <nav>
        <div class="content">
            <a><img @click="goToHome()" src="../assets/main_logo.png"></a>
            <div class="links">
                <a><img @click="goToRedactor()" src="../assets/icons/pen_icon.png"></a>
                <a><img @click="goToProfile()" src="../assets/icons/people_icon.png"></a>
                <a><img v-if="isLogged" @click="logout()" src="../assets/icons/out_icon.png"></a>
            </div>
        </div>
    </nav>
</template>

<script>
    import Axios from 'axios'

    export default {
        data: function() {
            return {
                isLogged: false
            }
        },
        methods: {
            logout() {
                let req = "/account/logout?token=" + this.$cookies.get('token');
                Axios.post(req)
                    .then(() => {
                        this.isLogged = false;
                        this.$cookies.set('login', null);
                        this.$cookies.set('token', null);
                    })
            },
            goToProfile () {
                if (this.$cookies.get('token') !== null) {
                    let req = '/account/check_token?token=' + this.$cookies.get('token');
                    Axios.get(req)
                        .then((response) => {
                            if (response.data["status"] === "OK") {
                                if (this.$router.currentRoute.fullPath.toLowerCase()
                                    !== '/profile?id=' + this.$cookies.get('login').toLowerCase()) {
                                    this.$router.push('/profile?id=' + this.$cookies.get('login'));
                                    this.$emit('redirect');
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
        },
        mounted() {
            let req = '/account/check_token?token=' + this.$cookies.get('token');
            Axios.get(req)
                .then((response) => {
                    this.isLogged = (response.data['status'] === 'OK');
                })
        }
    }
</script>

<style scoped>
@import '../styles/Nuvbar.css';
</style>