<template>
  <div id="root">
    <div :class="cssClasses">
      <component
        :is="$route.meta.layout"
        :title="title"
        :is-x-small="screen.getScreenSizeInfo.isXSmall"
        :is-large="screen.getScreenSizeInfo.isLarge"
      >
        <!-- ✅ Conteneur stable en flex -->
        <div class="page-content">
          <!-- ✅ Force remount à chaque navigation -->
          <router-view :key="$route.fullPath"></router-view>
        </div>

        <template #footer>
          <app-footer />
        </template>
      </component>
    </div>
  </div>
</template>

<script>
import AppFooter from "./components/app-footer.vue";
import { sizes, subscribe, unsubscribe } from "./utils/media-query";
import { getCurrentInstance, reactive, onMounted, onBeforeUnmount, computed } from "vue";

function getScreenSizeInfo() {
  const screenSizes = sizes();

  return {
    isXSmall: screenSizes["screen-x-small"],
    isLarge: screenSizes["screen-large"],
    cssClasses: Object.keys(screenSizes).filter((cl) => screenSizes[cl]),
  };
}

export default {
  components: {
    AppFooter,
  },
  setup() {
    const vm = getCurrentInstance();

    const title = vm.proxy.$appInfo.title;
    const screen = reactive({ getScreenSizeInfo: {} });
    screen.getScreenSizeInfo = getScreenSizeInfo();

    function screenSizeChanged() {
      screen.getScreenSizeInfo = getScreenSizeInfo();
    }

    const observer = new MutationObserver(() => {
      const el = document.querySelector('[data-name="Layer 1"]')?.closest("div");

      if (el) {
        el.click();
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    onMounted(() => {
      subscribe(screenSizeChanged);
    });

    onBeforeUnmount(() => {
      unsubscribe(screenSizeChanged);
    });

    const cssClasses = computed(() => {
      return ["app"].concat(screen.getScreenSizeInfo.cssClasses);
    });

    return {
      title,
      screen,
      cssClasses,
    };
  },
};
</script>

<style lang="scss">
html,
body {
  margin: 0px;
  height: 100%;
  min-height: 100%;
}

#root {
  height: 100%;
}

/* ✅ important en flex */
* {
  box-sizing: border-box;
}

.app {
  display: flex;
  height: 100%;
  width: 100%;
  min-width: 320px;
}

/* ✅ le contenu doit pouvoir s'étirer en flex */
.page-content {
  flex: 1 1 auto;
  min-width: 0;   /* ✅ évite les comportements "bizarres" en flex */
  min-height: 0;  /* ✅ idem pour les hauteurs */
}
</style>
