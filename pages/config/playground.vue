<template>
  <v-row>
    <v-col cols="12">
      <iframe
        :src="url"
        frameborder="0"
      />
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      url: process.env.url,
    };
  },
};
</script>

<style>
iframe {
  width: 100%;
  min-height: 90vh;
  margin: 0 !important;
  padding: 0 !important;
}
</style>
