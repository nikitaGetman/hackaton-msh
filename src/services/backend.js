import client from '@/http/client'

import { generateMarkersBackend, generatePoints } from '@/utils/generator'

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
  //   {
  //     title: 'Реклама на радио',
  //     text: `Если вы хотите повысить узнаваемость у широких масс, закажите рекламу на радио. Цены разные, в зависимости от уровня и широты звучания радиостанции (местная или всероссийская).`
  //   },
  {
    title: 'Реклама в соцсетях.',
    text: `Реклама у видеоблогеров подходит для любых видов офлайн-бизнеса. При размещении рекламных постов в тематических сообществах вебмастер делает публикации в собственных группах или договаривается с администраторами сторонних. Этот инструмент также подходит практически всем рекламодателям.`
  },
  {
    title: 'Изучите аудиторию.',
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

const backendService = {
  fetchActivities() {
    return client.get('/api/v1/get_activities').then(res => {
      return res.map(({ config, ...params }) => ({
        ...params,
        config: { passability: config[2], population: config[0], competitors: 0, solvency: config[1], availability: 0 }
      }))
    })
  },

  fetchZones({ action, ...params }) {
    // const squares = generateSquares({
    //   startCoords: [55.79, 37.54],
    //   matrixSize: 20,
    //   sideLength: 0.007
    // })

    // return new Promise(resolve => {
    //   setTimeout(() => {
    //     resolve(squares)
    //   }, 1000)
    // })

    // return Promise.resolve(squares)

    // return client.get(`/api/v1/heatmap/${params.action}`, { params }).then(res => {
    //   const formattedResults = res.map(zone => ({
    //     coords: [
    //       [zone.lat, zone.lon],
    //       [zone.lat + zone.latDistance, zone.lon + zone.lonDistance]
    //     ],
    //     weight: zone.value,
    //     id: zone.id
    //   }))

    //   return formattedResults
    // })

    const actId = action
    return client.get(`/api/v1/heatmap`, { params: { actId, ...params } }).then(res => {
      const formattedResults = res.map(zone => ({
        coords: [
          [zone.lat, zone.lon],
          [zone.lat + zone.latDistance, zone.lon + zone.lonDistance]
        ],
        weight: zone.value,
        id: zone.id
      }))

      return formattedResults
    })
  },

  fetchZoneInfo(sectorId, actId) {
    const randomRecomendations = Array.from({ length: 3 }).map(() => {
      const index = Math.round(Math.random() * (RECOMENDATIONS.length - 1))
      return RECOMENDATIONS[index]
    })

    return client.get('/api/v1/get_sector_data', { params: { sectorId, actId } }).then(res => {
      console.log(res)

      const zone = {
        id: sectorId,
        passability: res.metrics[2].value || res.generalValue,
        population: res.metrics[0].value || res.generalValue,
        competitors: res.generalValue,
        solvency: res.metrics[1].value || res.generalValue,
        availability: res.generalValue,
        recomendations: randomRecomendations
        // rating: res.generalValue
      }
      zone.passability = zone.passability > 1 ? 0.9 : zone.passability
      zone.population = zone.population > 1 ? 0.9 : zone.population
      zone.solvency = zone.solvency > 1 ? 0.9 : zone.solvency

      zone.rating = (zone.passability + zone.population + zone.solvency) / 3
      zone.rating = zone.rating > 1 ? 0.9 : zone.rating

      console.log(zone)

      return zone
    })
    // return new Promise(resolve => {
    //   setTimeout(() => {
    //     resolve(zone)
    //   }, 1000)
    // })
  },

  //   type = 'rent' || 'sell' || null
  //   { action, type }
  fetchAvailablePoints() {
    // const points = generatePoints({
    //   startCoords: [55.79, 37.54],
    //   endCoords: [55.79 - 0.007 * 10, 37.54 + 0.007 * 20],
    //   count: 20
    // })

    // return Promise.resolve(points)

    return client.get('/api/v1/get_some_offices').then(res => {
      const markers = generateMarkersBackend(res)
      return markers
    })
  },

  fetchConcurents({ action }) {
    const count = 15 + action * 2

    const points = generatePoints({
      startCoords: [55.751644, 37.55],
      endCoords: [55.72, 37.693],
      count
    })

    return Promise.resolve(points)
  }
}

export default backendService
