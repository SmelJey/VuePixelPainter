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
    const axios = Axios.create({
        baseURL: 'http://localhost:8080/account',
        timeout: 1000,
        headers: {
            'Access-Control-Allow-Origin': 'http://localhost:8080/',
            'allow_origins' : 'http://localhost:8080/'
        }
    });

export default {
    methods: {
        goToProfile () {
            console.log(this.$cookies.get('token'));
            if (this.$cookies.get('token') !== null) {
                axios.get('check_token?token=' + this.$cookies.get('token'))
                    .then((response) => {
                        console.log(response.data);
                        if (response.data["status"] === "OK") {
                            if (this.$router.currentRoute.fullPath.toLowerCase()
                                !== '/profile?id=' + this.$cookies.get('login').toLowerCase()) {
                                this.$router.push('/profile?id=' + this.$cookies.get('login'))
                            }
                        } else {
                            this.$router.push('/auth?cb=' + this.$router.currentRoute.fullPath);
                        }
                    })
                    .catch((error) => {
                        console.log(error)
                    })

            } else {
                this.$router.push('/auth?cb=' + this.$router.currentRoute.fullPath)
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