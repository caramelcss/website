<template>
  <div class="docs">
    <div class="hero --medium">
      <div class="header">
        <nav class="bar static transparent">
          <ul>
            <li class="collapse"><a href="#"><i class="fa fa-bars"></i></a></li>
            <li class="brand">
              <router-link to="/">
                <img src="../assets/logo_clear.svg" width="30px" height="26px">
              </router-link>
            </li>
            <li><router-link to="/">Home</router-link></li>
            <!--<li><a href="https://github.com/caramelcss/caramel#getting-started">Get Started</a></li>-->
            <li><router-link to="/docs">Documentation</router-link></li>
            <ul class="right">
              <li>
                <a href="https://github.com/caramelcss/caramel" target="_blank">
                  <i class="fa fa-github fa-fw"></i>
                </a>
              </li>
            </ul>
          </ul>
        </nav>
      </div>
      <div class="container">
        <img class="logo" src="../assets/logo_clear.svg" height="128px" width="128px">
      </div>
    </div>

    <div class="layout">
      <div class="sidebar">
        <ul>
          <div v-for="category of categories">
            <li class="title">{{ category.title }}</li>
            <router-link :to="`/docs/${category.path}/${child.path}`" v-for="child of category.children"><li>{{ child.title }}</li></router-link>
            <li class="separator"></li>
          </div>
        </ul>
      </div>

      <div class="content">
        <h1 class="title">{{ file.title }}</h1>
        <div id="content" v-html="content"></div>
      </div>
    </div>

    <div class="footer centered">
      <div class="container">
        <div class="links">
          <a href="https://www.patreon.com/kurisubrooks" target="_blank">Donate</a>
          <a href="https://github.com/caramelcss/caramel">GitHub</a>
          <a href="https://github.com/caramelcss/caramel/blob/v2/LICENSE">License</a>
        </div>
        <br>
        <p>Made by <a href="https://kurisubrooks.com" target="_blank">Kurisu Brooks</a></p>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import $ from 'jquery';
  import request from 'superagent';
  import yaml from 'js-yaml';

  export default {
    name: 'docs',

    data() {
      return { file: {}, content: '', categories: [], index: 0 };
    },

    methods: {
      async handleRoute() {
        this.$data.loaded = false;

        const res = await request.get('https://raw.githubusercontent.com/caramelcss/caramel/v2/docs/index.yml').buffer();
        const docs = yaml.safeLoad(res.text);

        const category = docs.find(o => o.path === (this.$route.params.category || 'introduction'));
        let index = category.children.findIndex(o => o.path === this.$route.params.file);
        if (index === -1) index = 0;

        const file = category.children[index];

        console.log(category, file);

        this.$data.file = file;
        this.$data.categories = docs;
        this.$data.index = index;

        try {
          const res2 = await request.get(`https://raw.githubusercontent.com/caramelcss/caramel/v2/docs/${category.path}/${file.path}.md`).buffer();
          this.$data.content = Vue.filter('marked')(res2.text);
        } catch (err) {
          console.error(err);
        }

        $(() => {
          $('[id=nav-top]').click(() => {
            $('html, body').animate({ scrollTop: 0 }, 'fast');
          });
        });
      },
    },

    watch: {
      $route(to) {
        this.handleRoute(to);
      },
    },

    created() {
      this.handleRoute(this.$route);
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="sass">
  @import '~caramel'

  main, .container
    max-width: 1100px

  main
    margin-bottom: 5em

  .hero
    text-align: center
    background: #c69c6d
    background: linear-gradient(25deg, #c69c6d 0%, #a67c52 100%)
    background: -moz-linear-gradient(25deg, #c69c6d 0%, #a67c52 100%)
    background: -webkit-linear-gradient(25deg, #c69c6d 0%, #a67c52 100%)
    // margin-bottom: 50px;
    pre
      margin: 0 auto
      max-width: 300px
      padding: 12px 24px

  .cellar
    padding: 3em 0 2em
    text-align: center
    background: #fafafa
    border-bottom: 2px solid rgba(0, 0, 0, 0.1)

  h5
    margin-bottom: 1em

  @media (max-width: 800px)
    .full
      padding-bottom: 2em

  .sidebar
    a
      color: #3F3F3F
      text-decoration: none
</style>
