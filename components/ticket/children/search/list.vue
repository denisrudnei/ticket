<template>
  <v-row>
    <v-col>
      <v-data-table
        v-model="selected"
        :items="value"
        :headers="headers"
        show-select
        item-key="id"
        :options.sync="pagination"
        :server-items-length="pagination.totalItems"
      >
        <template #item.id="{ item }">
          {{ item.id }}
        </template>
        <template #item.priority="{ item }">
          {{ item.priority.name }}
        </template>
        <template #item.actualUser="{ item }">
          <v-list-item v-if="item.actualUser">
            <v-list-item-avatar>
              <img :src="item.actualUser.picture">
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>
                {{ item.actualUser.name }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ item.actualUser.contactEmail }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </template>
        <template #item.resume="{ item }">
          {{ item.resume }}
        </template>
        <template #item.status="{ item }">
          {{ item.status.name }}
        </template>
        <template #item.group="{ item }">
          {{ item.group.name }}
        </template>
        <template #item.category="{ item }">
          {{ item.category.fullName }}
        </template>
        <template #item.created="{ item }">
          {{ item.created | date }}
        </template>
        <template #item.modified="{ item }">
          {{ item.modified | date }}
        </template>
      </v-data-table>
      <v-btn
        class="primary white--text"
        :disabled="selected.length === 0"
        @click="addChildren"
      >
        <v-icon>add</v-icon>
        {{ $t('add_children') }}
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'ChildrenList',
  props: {
    value: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      selected: [],
    };
  },
  computed: {
    pagination: {
      get() {
        return this.$store.getters['ticket/getPagination'];
      },
      set(value) {
        this.$store.commit('ticket/setPagination', value);
        this.$emit('updatePagination');
      },
    },
    headers() {
      return [
        {
          text: this.$t('select'),
          value: 'actions',
        },
        {
          text: this.$t('number_of_ticket'),
          value: 'id',
        },
        {
          text: this.$t('priority'),
          value: 'priority',
        },
        {
          text: this.$t('actual_user'),
          value: 'actualUser',
        },
        {
          text: this.$t('resume'),
          value: 'resume',
        },
        {
          text: this.$t('status'),
          value: 'status',
        },
        {
          text: this.$t('group'),
          value: 'group',
        },
        {
          text: this.$t('category'),
          value: 'category',
        },
        {
          text: this.$t('creation_date'),
          value: 'created',
        },
        {
          text: this.$t('modified_date'),
          value: 'modified',
        },
      ];
    },
  },
  methods: {
    addChildren() {
      this.$emit('input', this.selected);

      this.selected = [];
    },
  },
};
</script>

<style></style>
