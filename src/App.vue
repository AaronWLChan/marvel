<template>
  <div id="app">
    <Header/>
      <div class="bg-black bg-opacity-70 pt-8 pb-16 min-h-screen"
         :style="styleObject">
        <router-view/>
      </div>
    <Footer/>
  </div>
</template>

<script>
import Header from "./components/Header.vue"
import Footer from "./components/Footer.vue"

export default {
  name: 'App',

  data(){
    return {
      styleObject: {
        'background-image': 'url(' + require('@/assets/background.jpg') + ')',
      }
    }
  },

  components: {
    Header,
    Footer,
  }
}
</script>

