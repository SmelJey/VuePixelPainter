<template>
    <div class="main">
        <Navbar/>
    </div>   
</template>

<script>
import Navbar from './Navbar.vue'

export default {
    name: 'Home',
    components: {
        Navbar
    }
}
</script>

<style scoped>
@import '../styles/Main.css';
</style>