<template>
  <v-row>
    <v-col cols="6">
      <v-text-field
        v-model="priority.name"
        label="Texto"
        filled
      />
    </v-col>
    <v-col cols="6">
      <v-text-field
        v-model="priority.weight"
        label="Peso"
        type="number"
        filled
      />
    </v-col>
    <v-col>
      <v-btn
        class="primary white--text"
        @click="save"
      >
        {{ $t('save') }}
        <v-icon>
          save
        </v-icon>
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      default: () => ({
        name: '',
        weight: 0,
      }),
    },
  },
  data() {
    return {
      priorityData: {
        name: '',
        weight: 0,
      },
    };
  },
  computed: {
    priority() {
      return Object.assign(this.priorityData, this.value);
    },
  },
  methods: {
    save() {
      this.$emit('input', {
        name: this.priority.name,
        weight: parseInt(this.priority.weight, 10),
      });
    },
  },
};
</script>

<style></style>
