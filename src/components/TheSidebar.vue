<template>
  <div class="the-sidebar d-flex flex-column fill-height flex-start">
    <base-loader :active="loading" />

    <p>Заполните поля ниже, чтобы мы смогли порекомендовать вам наиболее подходящее место для открытие бизнеса.</p>

    <div class="the-sidebar__row">
      <v-select
        v-model="industry"
        :items="industryItems"
        return-object
        label="Отрась"
        outlined
        hide-details
        clearable
      />
    </div>
    <div class="the-sidebar__row">
      <v-select
        v-model="type"
        :disabled="!industry"
        :items="typeItems"
        label="Вид деятельности"
        return-object
        outlined
        hide-details
        clearable
      />
    </div>
    <div class="the-sidebar__row">
      <v-select
        v-model="price"
        :items="priceOptions"
        return-object
        label="Ценновой сегмент"
        outlined
        hide-details
        clearable
      />
    </div>

    <v-spacer />

    <v-btn color="primary" @click="submit">Поиск рекомендаций</v-btn>
  </div>
</template>

<script>
import BaseLoader from '@/components/BaseLoader.vue'

const INDUSTRIES = [
  {
    text: 'Фуд ритейл',
    types: [
      {
        id: 1,
        text: 'Булочная'
      },
      {
        id: 2,
        text: 'Продуктовый магазин'
      },
      {
        id: 1,
        text: 'Мясной магазин'
      }
    ]
  },
  {
    text: 'Красота и здоровье',
    types: [
      {
        id: 1,
        text: 'Парикмахерская'
      },
      {
        id: 2,
        text: 'Стоматология'
      },
      {
        id: 1,
        text: 'Ветеринарная клиника'
      }
    ]
  },
  {
    text: 'Общественное питание',
    types: [
      {
        id: 1,
        text: 'Кафе'
      },
      {
        id: 2,
        text: 'Ресторан'
      },
      {
        id: 1,
        text: 'Бар'
      }
    ]
  }
]
const PRICE_OPTIONS = [
  { text: 'Эконом', value: 'econom' },
  { text: 'Массовый', value: 'mass' },
  { text: 'Премиум', value: 'premium' }
]

export default {
  name: 'TheSidebar',
  components: { BaseLoader },
  props: {
    loading: { type: Boolean, default: false }
  },
  data() {
    return {
      industry: null,
      type: null,
      price: null
    }
  },
  computed: {
    industryItems() {
      return INDUSTRIES
    },
    typeItems() {
      return this.industry ? this.industry.types : []
    },
    priceOptions() {
      return PRICE_OPTIONS
    }
  },
  methods: {
    submit() {
      const { industry, type, price } = this
      this.$emit('submit', { industry, type, price })
    }
  }
}
</script>

<style lang="scss">
.the-sidebar {
  &__row {
    margin-bottom: 12px;
  }
}
</style>
