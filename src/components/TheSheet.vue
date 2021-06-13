<template>
  <v-bottom-sheet v-model="localValue" inset hide-overlay persistent no-click-animation>
    <v-sheet class="the-sheet pt-6 px-4" :class="{ 'the-sheet--expanded': expanded }">
      <base-loader :active="loading" />

      <div class="the-sheet__actions">
        <v-btn v-if="expanded" icon @click="expanded = false">
          <v-icon>mdi-arrow-collapse</v-icon>
        </v-btn>

        <v-btn v-else icon @click="expanded = true">
          <v-icon>mdi-arrow-expand</v-icon>
        </v-btn>

        <v-btn icon class="ml-1" @click="localValue = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>

      <div class="the-sheet__content">
        <div v-if="!isPoint && data" class="the-sheet__params">
          <div class="the-sheet__row">
            <span class="the-sheet__label">
              Проходимость:
              <base-tooltip>По данным Wi-Fi радаров</base-tooltip>
            </span>
            <v-rating
              background-color="grey"
              :value="dataset.passability.value"
              :color="getColorByValue(dataset.passability.value)"
              dense
              readonly
              half-increments
              length="5"
              size="32"
            />
          </div>
          <p>{{ dataset.passability.info }}</p>

          <div class="the-sheet__row">
            <span class="the-sheet__label">
              Население:
              <base-tooltip>Количество людей проживающих в данной зоне</base-tooltip>
            </span>
            <v-rating
              background-color="grey"
              :value="dataset.population.value"
              :color="getColorByValue(dataset.population.value)"
              dense
              readonly
              half-increments
              length="5"
              size="32"
            />
          </div>
          <p>{{ dataset.population.info }}</p>

          <div class="the-sheet__row">
            <span class="the-sheet__label">
              Конкуренты:
              <base-tooltip>Количество аналогичных бизнесев в данной зоне</base-tooltip>
            </span>
            <v-rating
              background-color="grey"
              :value="dataset.competitors.value"
              :color="getColorByValue(dataset.competitors.value)"
              dense
              readonly
              half-increments
              length="5"
              size="32"
            />
          </div>
          <p>{{ dataset.competitors.info }}</p>

          <div class="the-sheet__row">
            <span class="the-sheet__label">
              Платежеспособность:
              <base-tooltip>Данные основаны на средней стоимости кв/м жилья</base-tooltip>
            </span>
            <v-rating
              background-color="grey"
              :value="dataset.solvency.value"
              :color="getColorByValue(dataset.solvency.value)"
              dense
              readonly
              half-increments
              length="5"
              size="32"
            />
          </div>
          <p>{{ dataset.solvency.info }}</p>

          <div class="the-sheet__row">
            <span class="the-sheet__label">
              Общественная доступность:
              <base-tooltip>Близость к станциям метро или автобусным остановкам</base-tooltip>
            </span>
            <v-rating
              background-color="grey"
              :value="dataset.availability.value"
              :color="getColorByValue(dataset.availability.value)"
              dense
              readonly
              half-increments
              length="5"
              size="32"
            />
          </div>
          <p>{{ dataset.availability.info }}</p>

          <div v-if="totalRating" class="the-sheet__rating">
            <span class="the-sheet__rating-text text-h6">Рейтинг</span>
            <div class="the-sheet__rating-value d-flex align-center justify-center">
              <span class="text-h4 mr-1">{{ totalRating }}</span>
              <v-icon size="32" :color="getColorByValue(totalRating)">mdi-star</v-icon>
            </div>
          </div>
        </div>
        <v-btn v-if="isPoint" color="primary" outlined @click="openPanorama">Открыть панораму</v-btn>

        <div class="the-sheet__recomendations">
          <div class="the-sheet__label font-weight-regular">
            Персональные рекомендации:
            <base-tooltip>Эти рекомендации помогут вам быстрее развить бизнес в данном месте</base-tooltip>
          </div>
          <ol class="ml-4">
            <li v-for="(rec, index) in recomendations" :key="index" class="the-sheet__recomendation">
              <span class="font-weight-bold">{{ rec.title }}</span> {{ rec.text }}
            </li>
          </ol>
        </div>
      </div>
    </v-sheet>
  </v-bottom-sheet>
</template>

<script>
import BaseLoader from '@/components/BaseLoader.vue'
import BaseTooltip from '@/components/BaseTooltip.vue'

export default {
  name: 'TheSheet',
  components: { BaseLoader, BaseTooltip },
  props: {
    value: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    type: { type: String, default: '' },
    data: { type: Object, default: null }
  },
  data() {
    return {
      expanded: false
    }
  },
  computed: {
    localValue: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    },
    dataset() {
      if (!this.data) return {}

      const { passability, population, competitors, solvency, availability } = this.data
      const dataset = {
        passability: { value: passability * 5, info: 'В день через данную зону проходит примерно 700 человек' },
        population: { value: population * 5, info: 'Здесь проживает около 500 человек' },
        competitors: { value: competitors * 5, info: 'В данной зоне 15 конкурирующих предприятий' },
        solvency: { value: solvency * 5, info: 'Здесь высокий уровень жизни' },
        availability: { value: availability * 5, info: 'Две станции метро расположены в пешей доступности' }
      }

      return dataset
    },
    recomendations() {
      return this.data && this.data.recomendations
    },
    totalRating() {
      return this.data && Math.round(this.data.rating * 50) / 10
    },
    isPoint() {
      return this.type === 'avail' || this.type === 'conc'
    }
  },
  watch: {
    value(val) {
      if (val) this.expanded = false
    }
  },
  methods: {
    getColorByValue(value) {
      const COLORS = {
        worst: 'red darken-1',
        bad: 'orange lighten-1',
        normal: 'light-green lighten-1',
        best: 'green lighten-1'
      }

      if (value < 2) return COLORS.worst
      if (value <= 3) return COLORS.bad
      if (value <= 4) return COLORS.normal
      return COLORS.best
    },
    openPanorama() {
      this.$emit('open-panorama', this.data.geometry.coordinates)
    }
  }
}
</script>

<style lang="scss">
.the-sheet {
  display: flex;
  flex-direction: column;
  position: relative;
  height: 260px;
  transition: all 0.3s ease-in-out;

  &--expanded {
    height: 600px;
  }

  &__actions {
    position: absolute;
    right: 12px;
    top: 12px;
    z-index: 100;
  }

  &__content {
    overflow-y: auto;
    padding-bottom: 32px;
  }

  &__params {
    margin-bottom: 24px;
    position: relative;
  }

  &__row {
    display: flex;
    align-items: flex-end;
    margin-bottom: 12px;
  }
  &__label {
    font-size: 18px;
    font-weight: 500;
    margin-right: 12px;
    min-width: 160px;
  }
  &__rating {
    position: absolute;
    right: 64px;
    top: 32px;

    width: 120px;
    height: 100px;
    text-align: center;
    border: 2px solid #cccccccc;
    border-radius: 16px;
    padding: 10px;
  }

  &__recomendation {
    padding-left: 8px;
    padding-top: 4px;
  }
}
</style>
