<template>
  <div id="app" :class="DARK_THEME ? 'dark' : ''">
    <div>
      <NavigationBarComponent />
      <transition name="router-anim" mode="out-in">
        <router-view />
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
// * vue
import { Component, Vue } from 'vue-property-decorator';

// * components
import NavigationBarComponent from '@/components/Navigation/NavigationBar.component.vue';
import { DARK_THEME } from '@/store/modules/main/getters';
// * content
import { ROUTES } from '@/constants';
import { mapGetters } from 'vuex';

// * components setup
@Component({
  components: { NavigationBarComponent },
  computed: mapGetters({ DARK_THEME }),
})
export default class App extends Vue {
  // * private
  private readonly ROUTES: {} = ROUTES;
  private requiresAuth: boolean = false;

  constructor() {
    super();
  }

  private updated() {
    this.requiresAuth = this.$router.currentRoute.meta.requiresAuth;
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/_app.scss';
</style>
