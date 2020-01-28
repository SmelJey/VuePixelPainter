<template>
    <div class="main">
        <Navbar/>
        <Cards :request="'/get?token=' + this.$cookies.get('token')"  />
    </div>   
</template>

<script>
    import Navbar from './Navbar.vue'
    import Cards from './Cards.vue'

    export default {
        name: 'Home',
        components: {
            Navbar,
            Cards
        },
    }
</script>

<style scoped>
@import '../styles/Main.css';
</style>