<template>
  <v-row>
    <v-col md="6" cols="12">
      <v-text-field v-model="name" filled :label="$t('name')" />
    </v-col>
    <v-col md="6" cols="12">
      <v-text-field
        v-model="limit"
        v-mask="mask"
        filled
        :label="$t('limit_time')"
      />
    </v-col>
    <v-col>
      <v-btn class="primary white--text" @click="save">
        Enviar
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import { mask } from 'vue-the-mask';

export default {
  directives: {
    mask,
  },
  data() {
    return {
      name: '',
      limit: '00:00',
      mask: '##:##',
    };
  },
  methods: {
    save() {
      this.$emit('input', {
        name: this.name,
        limit: this.limit,
      });
    },
  },
};
</script>

<style></style>
