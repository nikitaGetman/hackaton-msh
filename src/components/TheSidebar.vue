<template>
  <div class="the-sidebar d-flex flex-column fill-height flex-start">
    <base-loader :active="loading" />
    <p>Заполните поля ниже, чтобы мы смогли порекомендовать вам наиболее подходящее место для открытие бизнеса.</p>

    <div class="the-sidebar__row">
      <v-select
        v-model="scope"
        :items="scopes"
        return-object
        item-text="scopeName"
        label="Отрасль"
        outlined
        hide-details
        clearable
        :loading="industryLoading"
      />
    </div>
    <div class="the-sidebar__row">
      <v-select
        v-model="action"
        :disabled="!scope"
        :items="actionItems"
        label="Вид деятельности"
        :loading="industryLoading"
        return-object
        item-text="name"
        item-value="id"
        outlined
        hide-details
        clearable
      />
    </div>

    <v-btn v-if="isCustomFiltersOpen" class="mb-2" outlined color="info" @click="isCustomFiltersOpen = false">
      Скрыть фильтры
    </v-btn>

    <v-btn v-else outlined color="info" @click="isCustomFiltersOpen = true">Подробные фильтры</v-btn>

    <template v-if="isCustomFiltersOpen">
      <p>Укажите индивидуальные значения фильтров, согласно вашему запросу</p>

      <div class="the-sidebar__row">
        <div class="text-h6">Проходимость</div>
        <v-slider
          v-model="customFilters.passability"
          :tick-labels="tickLabels.passability"
          :max="5"
          :min="1"
          :step="1"
          ticks="always"
          tick-size="4"
        />
      </div>
      <div class="the-sidebar__row">
        <div class="text-h6">Население (человек)</div>
        <v-slider
          v-model="customFilters.population"
          :tick-labels="tickLabels.population"
          :max="5"
          :min="1"
          :step="1"
          ticks="always"
          tick-size="4"
        />
      </div>
      <div class="the-sidebar__row">
        <div class="text-h6">Конкуренция</div>
        <v-slider
          v-model="customFilters.competitors"
          :tick-labels="tickLabels.competitors"
          :max="5"
          :min="1"
          :step="1"
          ticks="always"
          tick-size="4"
        />
      </div>
      <div class="the-sidebar__row">
        <div class="text-h6">Достаток</div>
        <v-slider
          v-model="customFilters.solvency"
          :tick-labels="tickLabels.solvency"
          :max="5"
          :min="1"
          :step="1"
          ticks="always"
          tick-size="4"
        />
      </div>
      <div class="the-sidebar__row">
        <div class="text-h6">
          Общественная доступность
          <base-tooltip>Расстояние до станций метро или остановок общественного транспорта</base-tooltip>
        </div>
        <v-slider
          v-model="customFilters.availability"
          :tick-labels="tickLabels.availability"
          :max="5"
          :min="1"
          :step="1"
          ticks="always"
          tick-size="4"
        />
      </div>
    </template>

    <v-spacer />

    <v-btn color="primary" :disabled="isSubmitDisabled" @click="submit">Поиск рекомендаций</v-btn>
  </div>
</template>

<script>
import BaseLoader from '@/components/BaseLoader.vue'
import BaseTooltip from '@/components/BaseTooltip.vue'
import backendService from '@/services/backend'

// const PRICE_OPTIONS = [
//   { text: 'Эконом', value: 'econom' },
//   { text: 'Массовый', value: 'mass' },
//   { text: 'Премиум', value: 'premium' }
// ]
// const DEFAULT_SCOPES = [
//   { scopeId: 1, scopeName: 'Фуд ритейл', id: 1, name: 'Булочная' },
//   { scopeId: 1, scopeName: 'Фуд ритейл', id: 2, name: 'Продуктовый магазин' },
//   { scopeId: 2, scopeName: 'Красота и здоровье', id: 3, name: 'Парикмахерская' },
//   { scopeId: 2, scopeName: 'Красота и здоровье', id: 4, name: 'Салон красоты' },
//   { scopeId: 2, scopeName: 'Красота и здоровье', id: 5, name: 'Стоматология' },
//   { scopeId: 3, scopeName: 'Общественное питание', id: 6, name: 'Кафе' },
//   { scopeId: 3, scopeName: 'Общественное питание', id: 7, name: 'Бар' }
// ]

export default {
  name: 'TheSidebar',
  components: { BaseLoader, BaseTooltip },
  props: {
    loading: { type: Boolean, default: false }
  },
  data() {
    return {
      industryItems: [],
      industryLoading: false,
      scope: null,
      action: null,
      // price: null,

      isCustomFiltersOpen: false,
      customFilters: {
        passability: 0,
        population: 0,
        competitors: 0,
        solvency: 0,
        availability: 0
      },
      tickLabels: {
        passability: ['Низкая', '', 'Умеренная', '', 'Высокая'],
        population: ['<100', '', '~500', '', '>1000'],
        competitors: ['Низкая', '', 'Средняя', '', 'Высокая'],
        solvency: ['Низкий', '', 'Средний', '', 'Высокий'],
        availability: ['>300 м', '', '~750 м', '', '>2 км']
      }
    }
  },
  computed: {
    scopes() {
      return this.industryItems.reduce((acc, value) => {
        if (!acc.find(v => v.scopeId === value.scopeId)) {
          acc.push({ scopeId: value.scopeId, scopeName: value.scopeName })
        }
        return acc
      }, [])
    },
    actionItems() {
      return this.scope
        ? this.industryItems
            .filter(v => v.scopeId === this.scope.scopeId)
            .map(({ name, id, config }) => ({ name, id, config }))
        : []
    },
    // priceOptions() {
    //   return PRICE_OPTIONS
    // },
    isSubmitDisabled() {
      return this.isCustomFiltersOpen ? false : !this.action
    }
  },
  watch: {
    action(val) {
      const config = val && val.config ? val.config : {}

      this.customFilters = {
        passability: config.passability,
        population: config.population,
        competitors: config.competitors,
        solvency: config.solvency,
        availability: config.availability
      }
    }
  },
  created() {
    // this.industryItems = DEFAULT_SCOPES
    this.industryLoading = true
    backendService
      .fetchActivities()
      .then(res => {
        this.industryItems = res
      })
      .finally(() => {
        this.industryLoading = false
      })
  },
  methods: {
    submit() {
      if (this.isCustomFiltersOpen) {
        const { customFilters } = this
        this.$emit('submit', { ...customFilters })
      } else {
        const { action } = this
        this.$emit('submit', { action: action.id })
      }
    }
  }
}
</script>

<style lang="scss">
.the-sidebar {
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 90px);
  overflow: auto;
  &__row {
    margin-bottom: 12px;
  }
}
</style>
