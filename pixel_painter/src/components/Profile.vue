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
        <a><img @click="goToHome()" src="../assets/test/iconback.png"></a>
    </div>
</template>

<script>
export default {
    name: 'Profile',
    data: function(){
        return {
            accountPic: 'https://bulma.io/images/placeholders/96x96.png',
            accountName: 'John Smith',
            accountMeta: '@ggwp'
        }
    },
    methods: {
        goToProfile () {
            this.$router.push({name: 'Profile'})
        },
        goToRedactor () {
            this.$router.push({name: 'Painter'})
        },
        goToHome () {
            this.$router.push({name: 'Home'})
        }
    },
    computed: {
        getImages() {
            //todo backend task
            return [{id: 1, url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAa0lEQVQ4T62TQQ4AIQgD4f+PZsPBsDatxCBHhbFAdRuGD+vtNSDCzAGaZxiVQ5LzchUhLEH7I+I1VrhUtICuOEFtC2w3vC0xgxFgl1gotiFDH6jpq1VGECOxZFRVOQcn/kF6M6+tfP+1xgo+WtAqDbTLNqoAAAAASUVORK5CYII='},
                    {id: 2, url: 'https://bulma.io/images/placeholders/96x96.png'},
                    {id: 3, url: 'https://bulma.io/images/placeholders/96x96.png'},
                    {id: 4, url: 'https://bulma.io/images/placeholders/96x96.png'}]
        }
                            }
}
</script>

<style scoped>
  @import '../css/Nuvbar.css';
</style>