<template>
  <v-tooltip top>
    <template v-slot:activator="{ on, attrs }">
      <v-icon color="gray" v-bind="attrs" :size="size" class="ml-1" v-on="on">
        mdi-help-circle-outline
      </v-icon>
    </template>
    <span>
      <slot />
    </span>
  </v-tooltip>
</template>

<script>
export default {
  name: 'BaseTooltip',
  props: {
    size: { type: Number, default: 16 }
  }
}
</script>
