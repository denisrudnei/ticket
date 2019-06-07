<template>
  <div>
    <input
      ref="color"
      v-model="value"
      style="display: none"
      type="color"
      @change="changeColor()"
    >
    <v-btn
      class="primary white--text"
      @click="selectColor()"
    >
      <v-icon
        left
      >
        color_lens
      </v-icon>
      <slot />
    </v-btn>
  </div>
</template>
<script>
export default {
  data() {
    return {
      value: null
    }
  },
  methods: {
    changeColor() {
      this.$emit('input', this.value)
    },
    selectColor() {
      this.$refs.color.click()
    }
  }
}
</script>

<style scoped>
div {
  display: inline-block !important;
}
</style>
