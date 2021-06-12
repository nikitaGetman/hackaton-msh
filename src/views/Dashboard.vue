<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click="isSidebarOpen = !isSidebarOpen" />
    </v-app-bar>

    <v-main>
      <v-container fluid class="dashboard fill-height align-stretch">
        <v-row>
          <!-- <transition name="sidebar-slide"> -->
          <v-col v-show="isSidebarOpen" :cols="3" class="dashboard__sidebar">
            <the-sidebar :loading="isSidebarLoading" @submit="search" />
          </v-col>
          <!-- </transition> -->

          <v-col :cols="isSidebarOpen ? 9 : 12" class="dashboard__map-wrapper pa-0">
            <yandex-map
              :options="mapConfig.options"
              :settings="$options.MAP_SETTINGS"
              :coords="mapConfig.coords"
              :controls="mapConfig.controls"
              :zoom="mapConfig.zoom"
              @map-was-initialized="setMap"
            >
            </yandex-map>

            <div v-if="isPanoramaOpen" id="panorama-player" class="dashboard__panorama"></div>
          </v-col>
        </v-row>
      </v-container>

      <the-sheet
        v-model="isSheetOpen"
        :loading="isSheetLoading"
        :data="model.data"
        :type="model.type"
        @open-panorama="opanPanorama"
      />
    </v-main>
  </v-app>
</template>

<script>
/* eslint-disable no-undef */
import { yandexMap } from 'vue-yandex-maps'
import TheSidebar from '@/components/TheSidebar.vue'
import TheSheet from '@/components/TheSheet.vue'

import {
  generateSquares,
  generatePoints,
  generateMarkers,
  generateRectangles,
  generateObjects
} from '@/utils/generator'

const DEFAULT_MOSCOW_COORDS = Object.freeze([55.7503535552648, 37.61581057094254])
const MAP_SETTINGS = {
  apiKey: process.env.VUE_APP_MAP_KEY,
  lang: 'ru_RU',
  coordorder: 'latlong',
  version: '2.1'
}

export default {
  name: 'Dashboard',
  components: { yandexMap, TheSidebar, TheSheet },
  MAP_SETTINGS,
  data() {
    return {
      mapConfig: {
        coords: DEFAULT_MOSCOW_COORDS,
        zoom: 12,
        controls: ['zoomControl'],
        options: {
          restrictMapArea: [
            [55.4, 37],
            [56, 38.2]
          ],
          autoFitToViewport: 'always'
        }
      },
      map: null,
      zonesManager: null,
      availPointsManager: null,
      concurentsManager: null,
      model: { type: null, objectId: null, data: null },
      isPanoramaOpen: false,
      isSidebarOpen: true,
      isSheetOpen: false,

      isSidebarLoading: false,
      isSheetLoading: false
    }
  },
  computed: {},
  watch: {
    // isSheetOpen(val) {
    //   if (!val) {
    //     this.zonesManager.objects.setObjectOptions(this.model.objectId, {
    //       strokeWidth: 0
    //     })
    //     this.model.objectId = null
    //     this.model.data = null
    //   }
    // }
  },
  created() {},
  methods: {
    handleZoneClick(e) {
      const objectId = e.get('objectId')
      const zone = this.zonesManager.objects.getById(objectId)
      const objectGeometry = zone.geometry.type
      if (objectGeometry === 'Rectangle') {
        this.clearModel()
        this.zonesManager.objects.setObjectOptions(objectId, {
          strokeWidth: 2
        })
        this.model.objectId = objectId
        this.model.data = zone
        this.model.type = 'zone'
        this.isSheetOpen = true
        this.isSheetLoading = true
        setTimeout(() => {
          this.isSheetLoading = false
        }, 1000)
      }
    },
    handleAvailClick(e) {
      const objectId = e.get('objectId')
      const point = this.availPointsManager.objects.getById(objectId)
      const objectGeometry = point.geometry.type
      if (objectGeometry === 'Point') {
        this.clearModel()

        this.availPointsManager.objects.setObjectOptions(objectId, {
          preset: 'islands#blueDotIcon'
        })
        this.model.objectId = objectId
        this.model.data = point
        this.model.type = 'avail'

        this.isSheetOpen = true
        this.isSheetLoading = true
        setTimeout(() => {
          this.isSheetLoading = false
        }, 1000)
      }
    },
    handleConcClick(e) {
      const objectId = e.get('objectId')
      const point = this.concurentsManager.objects.getById(objectId)
      const objectGeometry = point.geometry.type
      if (objectGeometry === 'Point') {
        this.clearModel()

        this.concurentsManager.objects.setObjectOptions(objectId, {
          preset: 'islands#redDotIcon'
        })
        this.model.objectId = objectId
        this.model.data = point
        this.model.type = 'conc'

        this.isSheetOpen = true
        this.isSheetLoading = true
        setTimeout(() => {
          this.isSheetLoading = false
        }, 1000)
      }
    },
    setMap(map) {
      this.map = map
      this.zonesManager = new ymaps.ObjectManager()
      this.zonesManager.objects.events.add(['click'], this.handleZoneClick)

      this.availPointsManager = new ymaps.ObjectManager({ clusterize: true, gridSize: 32 })
      this.availPointsManager.objects.options.set('preset', 'islands#blueCircleDotIcon')
      this.availPointsManager.clusters.options.set('preset', 'islands#blueClusterIcons')
      this.availPointsManager.objects.events.add(['click'], this.handleAvailClick)

      this.concurentsManager = new ymaps.ObjectManager()
      this.concurentsManager.objects.options.set('preset', 'islands#redCircleDotIcon')
      this.concurentsManager.clusters.options.set('preset', 'islands#invertedRedClusterIcons')
      this.concurentsManager.objects.events.add(['click'], this.handleConcClick)

      this.map.geoObjects.add(this.zonesManager)
      this.map.geoObjects.add(this.availPointsManager)

      this.search()
      // this.fetchAvailiablePoints()
    },
    search() {
      this.isSidebarLoading = true
      setTimeout(() => {
        const squares = generateSquares({
          startCoords: [55.79, 37.54],
          matrixSize: 20,
          sideLength: 0.007
        })
        const rects = generateRectangles(squares)
        const objects = generateObjects(rects)
        this.zonesManager.removeAll()
        this.zonesManager.add(objects)
        this.map.geoObjects.add(this.zonesManager)
        this.isSidebarLoading = false

        this.fetchAvailiablePoints()
        this.fetchConcurents()
      }, 100)
    },

    fetchAvailiablePoints() {
      const points = generatePoints({
        startCoords: [55.79, 37.54],
        endCoords: [55.79 - 0.007 * 10, 37.54 + 0.007 * 20],
        count: 20
      })
      const markers = generateMarkers(points)
      this.availPointsManager.removeAll()
      this.availPointsManager.add(markers)
      this.map.geoObjects.add(this.availPointsManager)
    },
    fetchConcurents() {
      const points = generatePoints({
        startCoords: [55.79, 37.54],
        endCoords: [55.79 - 0.007 * 10, 37.54 + 0.007 * 20],
        count: 20
      })
      const markers = generateMarkers(points)
      this.concurentsManager.removeAll()
      this.concurentsManager.add(markers)
      this.map.geoObjects.add(this.concurentsManager)
    },

    clearModel() {
      if (this.model.type === 'zone') {
        this.zonesManager.objects.setObjectOptions(this.model.objectId, {
          strokeWidth: 0
        })
      }
      if (this.model.type === 'avail') {
        this.availPointsManager.objects.setObjectOptions(this.model.objectId, {
          preset: 'islands#blueCircleDotIcon'
        })
      }
      if (this.model.type === 'conc') {
        this.concurentsManager.objects.setObjectOptions(this.model.objectId, {
          preset: 'islands#redCircleDotIcon'
        })
      }

      this.model.type = null
      this.model.objectId = null
      this.model.data = null
    },

    opanPanorama(coords) {
      if (!ymaps.panorama.isSupported()) return

      this.isSheetOpen = false
      this.isPanoramaOpen = true
      this.$nextTick(() => {
        ymaps.panorama.createPlayer('panorama-player', coords).done(player => {
          player.events.add(['destroy'], () => {
            this.isPanoramaOpen = false
            this.isSheetOpen = true
          })
        })
      })
    }
  }
}
</script>

<style lang="scss">
.dashboard {
  &__map-wrapper {
    // transition: all 0.3s;
    position: relative;
    .ymap-container {
      width: 100%;
      height: 100%;
    }
  }

  #panorama-player {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
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
</style>
