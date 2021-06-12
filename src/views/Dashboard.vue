<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click="isSidebarOpen = !isSidebarOpen" />
    </v-app-bar>

    <v-main>
      <v-container fluid class="dashboard fill-height align-stretch">
        <v-row>
          <!-- <transition name="sidebar-slide"> -->
          <v-col v-if="isSidebarOpen" :cols="3" class="dashboard__sidebar">
            <the-sidebar :loading="sidebarLoading" @submit="search" />
          </v-col>
          <!-- </transition> -->

          <v-col :cols="isSidebarOpen ? 9 : 12" class="dashboard__map-wrapper pa-0">
            <yandex-map
              :options="mapConfig.options"
              :settings="$options.MAP_SETTINGS"
              :coords="mapConfig.coords"
              :controls="[]"
              :zoom="mapConfig.zoom"
              @map-was-initialized="setMap"
            >
            </yandex-map>
          </v-col>
        </v-row>
      </v-container>

      <v-bottom-sheet :value="isSheetOpen" inset hide-overlay persistent no-click-animation>
        <v-sheet class="sheet pt-4 px-2">
          <base-loader :active="sheetLoading" />
          <v-btn icon class="sheet__close" @click="closeSheet">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <div class="sheet__content">
            <div class="mt-1 mx-3">
              Данные и рекомендации для участка
            </div>
          </div>
        </v-sheet>
      </v-bottom-sheet>
    </v-main>
  </v-app>
</template>

<script>
/* eslint-disable no-undef */
import { yandexMap } from 'vue-yandex-maps'
import TheSidebar from '@/components/TheSidebar.vue'
import BaseLoader from '@/components/BaseLoader.vue'
import { generateSquares, generateRectangles, generateObjects } from '@/utils/generator'

const DEFAULT_MOSCOW_COORDS = Object.freeze([55.7503535552648, 37.61581057094254])
const MAP_SETTINGS = {
  apiKey: process.env.VUE_APP_MAP_KEY,
  lang: 'ru_RU',
  coordorder: 'latlong',
  version: '2.1'
}

export default {
  name: 'Dashboard',
  components: { yandexMap, TheSidebar, BaseLoader },
  MAP_SETTINGS,
  data() {
    return {
      mapConfig: {
        coords: DEFAULT_MOSCOW_COORDS,
        zoom: 12,
        options: {
          restrictMapArea: [
            [55.4, 37],
            [56, 38.2]
          ],
          autoFitToViewport: 'always'
        }
      },
      map: null,
      objectManager: null,
      model: { objectId: null, data: null },
      isSidebarOpen: true,
      isSheetOpen: false,

      sidebarLoading: false,
      sheetLoading: false
    }
  },
  computed: {},
  created() {},
  methods: {
    handleRectangleClick(e) {
      const objectId = e.get('objectId')
      const zone = this.objectManager.objects.getById(objectId)
      const objectGeometry = zone.geometry.type
      if (objectGeometry === 'Rectangle') {
        if (this.model.objectId) {
          this.objectManager.objects.setObjectOptions(this.model.objectId, {
            fillOpacity: 0.3
          })
        }
        this.objectManager.objects.setObjectOptions(objectId, {
          fillOpacity: 0.1
        })
        this.model.objectId = objectId
        this.model.data = zone
        this.isSheetOpen = true
        this.sheetLoading = true
        setTimeout(() => {
          this.sheetLoading = false
        }, 1000)
      }
    },
    setMap(map) {
      this.map = map
      this.objectManager = new ymaps.ObjectManager()
      this.objectManager.objects.events.add(['click'], this.handleRectangleClick)

      this.search()
    },
    search() {
      this.sidebarLoading = true
      setTimeout(() => {
        const squares = generateSquares({
          startCoords: [55.79, 37.54],
          matrixSize: 15,
          sideLength: 0.007
        })
        const rects = generateRectangles(squares)

        const objects = generateObjects(rects)

        this.objectManager.removeAll()
        this.objectManager.add(objects)

        this.map.geoObjects.add(this.objectManager)

        this.sidebarLoading = false
      }, 100)
    },

    closeSheet() {
      this.isSheetOpen = false
    }
  }
}
</script>

<style lang="scss">
.dashboard {
  &__map-wrapper {
    // transition: all 0.3s;
    .ymap-container {
      width: 100%;
      height: 100%;
    }
  }

  // .sidebar-slide-enter-active {
  //   transition: all 0.3s;
  // }
  // .sidebar-slide-leave-active {
  //   transition: all 0.3s;
  // }
  // .sidebar-slide-enter,
  // .sidebar-slide-leave-to {
  //   transform: translateX(100px);
  //   opacity: 0;
  // }
}

.sheet {
  display: flex;
  flex-direction: column;
  position: relative;
  min-height: 200px;
  max-height: 250px;

  &__close {
    position: absolute;
    right: 12px;
    top: 12px;
  }
  &__content {
    overflow-y: auto;
  }
}
</style>
