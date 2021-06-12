<template>
  <v-bottom-sheet v-model="localValue" inset hide-overlay persistent no-click-animation>
    <v-sheet class="the-sheet pt-6 px-4">
      <base-loader :active="loading" />
      <v-btn icon class="the-sheet__close" @click="localValue = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <div class="the-sheet__content">
        <div class="the-sheet__params">
          <div v-for="(data, index) in dataset" :key="index" class="the-sheet__row">
            <span class="the-sheet__label">{{ data.label }}:</span>
            <v-rating
              background-color="grey"
              :color="getColorByValue(data.value)"
              half-increments
              length="5"
              size="32"
              :value="data.value"
              dense
              readonly
            />
          </div>

          <div class="the-sheet__rating">
            <span class="the-sheet__rating-text text-h6">Рейтинг</span>
            <div class="the-sheet__rating-value d-flex align-center justify-center">
              <span class="text-h4 mr-1">{{ totalRating }}</span>
              <v-icon size="32" :color="getColorByValue(totalRating)">mdi-star</v-icon>
            </div>
          </div>

          <v-btn v-if="isPoint" color="primary" outlined @click="openPanorama">Открыть панораму</v-btn>
        </div>

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

/* eslint-disable vue/max-len */
const RECOMENDATIONS = [
  {
    title: 'Разместите платное объявление на онлайн-картах.',
    text: `Google Карты, Яндекс.Карты, Яндекс.Навигатор и 2ГИС предлагают платные опции при размещении. 
          Эти возможности позволяют расширить карточку: пометить её цветом, рассказать об акциях и разместить витрину с товарами. 
          Также компания получает приоритет в поисковой выдаче на картах. Кроме платного размещения, на повышение рейтинга влияют положительные отзывы.`
  },
  {
    title: 'Используйте сайты отзывов.',
    text: `Работа с сайтами отзывов помогает управлять репутацией компании в интернете. 
            Заполняйте карточки компании на сайтах отзывов: Zoon, TripAdviser, IRecommend.ru, «Отзовик» и др. 
            Эти сервисы собирают отзывы.`
  },
  {
    title: 'Гиперлокальный таргетинг.',
    text: `Сегодня показывать рекламу аудитории одного города или региона — не предел. Сужайте цель до района, пары кварталов, дома или торгового центра. 
          Для этого есть инструменты гиперлокального таргетинга, они помогают найти ваших потенциальных клиентов по месту их работы или жительства. 
          Гиперлокальный таргетинг доступен при настройке рекламы во «ВКонтакте», Facebook, myTarget, Яндекс.Директе и Google Ads.`
  },
  {
    title: 'Цифровая наружняя реклама в общественных местах.',
    text: `Такие экраны активно появляются в Москве и Санкт-Петербурге. Стоимость тысячи показов рекламного объявления начинается от 280 рублей, поэтому данный способ доступен и малому бизнесу.`
  },
  {
    title: 'Indoor — реклама, которую размещают в помещениях.',
    text: `С ее помощью можно показать рекламное объявление в месте, где находятся заинтересованные в вашем продукте люди: разместить стойку, лайт-бокс, рамку или любой другой стенд. 
          Помечайте наружные рекламные объявления номерами статического коллтрекинга — этот метод позволит зафиксировать источники звонков. Таким образом вы оцените эффективность рекламной кампании.`
  },
  {
    title: 'Wi-Fi-радар и Wi-Fi-точка',
    text: `Wi-Fi — дополнительная точка коммуникации с клиентами. С его помощью вы можете собрать MAC-адреса телефонов посетителей и прохожих, а потом настроить на них таргетированную рекламу.`
  },
  {
    title: 'Реклама на радио',
    text: `Если вы хотите повысить узнаваемость у широких масс, закажите рекламу на радио. Цены разные, в зависимости от уровня и широты звучания радиостанции (местная или всероссийская).`
  },
  {
    title: 'Реклама в соцсетях.',
    text: `Реклама у видеоблогеров подходит для любых видов офлайн-бизнеса. При размещении рекламных постов в тематических сообществах вебмастер делает публикации в собственных группах или договаривается с администраторами сторонних. Этот инструмент также подходит практически всем рекламодателям.`
  },
  {
    title: 'Не распыляйтесь - сначала изучите аудиторию.',
    text: `Чтобы понять, какой именно метод сработает, изучите клиентов насколько возможно — где они живут, о чем думают, что смотрят. 
            И только после этого выбирайте способ продвижения бизнеса: возможно, именно на вашу аудитории личные продажи подействуют лучше, чем активная реклама.`
  },
  {
    title: 'Найдите способ общаться с клиентами регулярно.',
    text: `Доказано: у знакомых покупают лучше. Ищите способы контакта с клиентом: можно позвонить и спросить, как доставили товар, нет ли проблем с использованием. 
          Так вы показываете, что для вас действительно важная обратная связь.`
  },
  {
    title: 'Сотрудничайте с коллегами.',
    text: `Вокруг работают тысячи таких же предпринимателей. Пусть у них будут лежать ваши визитки или буклеты, а у вас — их. 
          Ставите пластиковые окна — обсудите с установщиками кондиционеров взаимный пиар. Ищите близкие сферы бизнеса и продвигайте друг друга.`
  },
  {
    title: 'Не забывайте про раздаточные материалы.',
    text: `Раздаточный материал — наиболее простое и очевидное решение. Подарки и брендированная продукция формируют у покупателя лояльность к бренду. 
            Также как и купоны на скидку, они стимулируют повторную покупку. Главный плюс данного метода кроется в его низкой стоимости. Главный минус — низкий охват целевой аудитории.`
  },
  {
    title: 'Участвуйте в мероприятиях.',
    text: `Хотите повысить лояльность клиентов и узнаваемость бренда как среди потребителя, так и среди партнёров — не ленитесь участвовать в различных мероприятиях. Таковых нет — создайте сами.`
  }
]

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
      dataset: [
        { label: 'Проходимость', value: 3.1 },
        { label: 'Население', value: 2 },
        { label: 'Конкуренты', value: 1 },
        { label: 'Платежеспособность', value: 4.9 }
      ],
      recomendations: RECOMENDATIONS
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
    totalRating() {
      return 3.5
    },
    isPoint() {
      return this.type === 'avail' || this.type === 'conc'
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
  min-height: 200px;
  max-height: 300px;

  &__close {
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
    flex-basis: 160px;
  }
  &__rating {
    position: absolute;
    right: 48px;
    top: 18px;

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
