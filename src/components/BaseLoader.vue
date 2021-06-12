<template>
  <vue-element-loading v-bind="$attrs" color="#2f80ed" :size="size" :spinner="spinner" duration="1" />
</template>

<script>
import VueElementLoading from 'vue-element-loading'

export default {
  name: 'BaseLoader',
  components: { VueElementLoading },
  props: {
    spinner: { type: String, default: 'spinner' },
    size: { type: String, default: '48' }
  }
}
</script>
