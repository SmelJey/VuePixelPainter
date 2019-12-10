<template>
    <div>
        <img src="../assets/test/cat.jpg">
        <a><img @click="goTocard()" src="../assets/test/iconback.png"></a>
    </div>
</template>

<script>
export default {
    name: 'Profile',
    methods: {
    goTocard () {
      this.$router.push({name: 'Home'})
    }
  }
}
</script>

<style scoped>

</style>