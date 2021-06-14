<template>
  <div class="map-legend" :class="{ 'map-legend--open': open }" @mouseenter="open = true" @mouseleave="open = false">
    <v-icon v-if="!open">mdi-help-circle-outline</v-icon>

    <template v-if="open">
      <p class="text-caption mb-3">
        Тепловая карта рассчитывается по специальной формуле, в которую входят: плотность населения, интенсивность
        трафика, уровень конкуренции, платежеспособность населения, а также доступность зоны с помощью общественного
        транспорта.
      </p>
      <p class="text-caption green lighten-4 px-2 mb-2">
        Зеленые участки - наиболее благоприятные для открытия бизнеса
      </p>
      <p class="text-caption red lighten-4 px-2 mb-2">Красные участки - наименее благоприятные</p>
      <p class="text-caption mb-1">
        <v-icon color="primary" size="16">mdi-circle-slice-8</v-icon> - таким маркером отображиются участки доступные
        для аренды или покупки
      </p>
      <p class="text-caption mb-1">
        <v-icon color="red" size="16">mdi-circle-slice-8</v-icon> - таким маркером отображиются конкуренты по вашему
        направлению
      </p>

      <v-switch v-model="localAvail" hide-details="" label="Показывать доступные для аренды участки"></v-switch>
      <v-switch v-model="localConc" color="red" label="Показывать конкурентов"></v-switch>
    </template>
  </div>
</template>

<script>
export default {
  name: 'MapLegend',
  props: {
    showAvail: { type: Boolean, default: false },
    showConc: { type: Boolean, default: false }
  },
  data() {
    return {
      open: false
    }
  },
  computed: {
    localAvail: {
      get() {
        return this.showAvail
      },
      set(val) {
        this.$emit('update:show-avail', val)
      }
    },
    localConc: {
      get() {
        return this.showConc
      },
      set(val) {
        this.$emit('update:show-conc', val)
      }
    }
  }
}
</script>

<style lang="scss">
.map-legend {
  position: absolute;
  width: 48px;
  height: 48px;
  background-color: #fefefe;
  box-shadow: 3px 1px 10px 0px rgba(50, 50, 50, 0.25);
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 590px;
  top: 24px;
  right: 24px;

  &--open {
    width: unset;
    height: unset;
    padding: 16px;
    align-items: stretch;
  }
}
</style>
