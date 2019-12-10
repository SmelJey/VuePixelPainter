<template>
    <nav class="navbar">
        <div class="logo">
            <img src="../assets/main_logo.png" width="300" height="50">
        </div>

        <div class="icons">
            <a><img src="../assets/icons/pen_icon.png" width="35" height="35"></a>
            <a><img @click="goTocard()" src="../assets/icons/people_icon.png" width="35" height="35"></a>
        </div>
    </nav>   
</template>

<script>
export default {
    name: 'Home',
    methods: {
    goTocard () {
      this.$router.push({name: 'Profile'})
    }
  }
}
</script>

<style scoped>
.navbar {
    background-color: #fe6e4b;
    height: 75px;
}
.icons {
    margin: auto;
    vertical-align: middle;
    margin-left: 45%;
}
.icons img {
    
    vertical-align: middle;
     margin-right: 30px;
}
.logo {
    margin: auto;
    vertical-align: middle;
    margin-left: 12%;
    display: flex;
}
</style>