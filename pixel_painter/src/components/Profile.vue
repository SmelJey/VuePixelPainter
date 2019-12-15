<template>
    <div>
     <nav class="navbar" role="navigation" aria-label="main navigation">
  <div class="navbar-brand">
    <a class="navbar-item" >
      <img src='../assets/main_logo.png' width="150" height="28">
    </a>

    <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
    </a>
  </div>

  <div id="navbarBasicExample" class="navbar-menu">
    <div class="navbar-start">
      <a class="navbar-item">
        Home
      </a>

      <a class="navbar-item">
        Documentation
      </a>

      <div class="navbar-item has-dropdown is-hoverable">
        <a class="navbar-link">
          More
        </a>

        <div class="navbar-dropdown">
          <a class="navbar-item">
            About
          </a>
          <a class="navbar-item">
            Jobs
          </a>
          <a class="navbar-item">
            Contact
          </a>
          <hr class="navbar-divider">
          <a class="navbar-item">
            Report an issue
          </a>
        </div>
      </div>
    </div>

    <div class="navbar-end">
      <div class="navbar-item">
        <div class="buttons">
          <a class="button is-primary">
            <strong>Sign up</strong>
          </a>
          <a class="button is-light">
            Log in
          </a>
        </div>
      </div>
    </div>
  </div>
</nav>

    <div>
        <section class="section">
            <div class="media">
                <div class="media-left">
                    <figure class="image is-98x98">
                        <img class="is-rounded" :src="accountPic">
                    </figure>
                </div>
                <div class="media-content">
                    <p class="title is-2">{{ accountName }}</p>
                    <p class="subtitle is-3">{{ accountMeta }}</p>
                </div>
            </div>
        </section>
        <section class="section">
            <div class="control">
                <textarea class="textarea is-large"></textarea>
            </div>
        </section>
        <section class="section">
            <img class="is-fullwidth is-98x98" v-for="image in getImages" :src="image.url" v-bind:key="image.id">
        </section>
    </div>

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
        goTocard () {
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
.navbar {
    background-color: #fe6e4b;
    height: 30px;
}

</style>