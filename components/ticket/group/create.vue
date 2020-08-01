<template>
  <v-row>
    <v-col cols="12" pa-3>
      <v-form>
        <v-text-field
          v-model="groupData.name"
          :placeholder="$t('name')"
          filled
        />
      </v-form>
    </v-col>
    <v-col cols="12" pa-3>
      <v-form>
        <v-textarea
          v-model="groupData.description"
          :placeholder="$t('description')"
          filled
        />
      </v-form>
    </v-col>
    <v-col>
      <v-card>
        <v-card-title>Disponíveis</v-card-title>
        <v-card-text>
          <v-text-field v-model="search" :label="$t('search')" />
          <v-list>
            <draggable group="group" :list="analysts">
              <v-list-item
                v-for="analyst in analysts"
                :key="analyst.id"
                @click="select"
              >
                {{ analyst.name }}
              </v-list-item>
            </draggable>
          </v-list>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col>
      <v-card>
        <v-card-title>Estão no grupo</v-card-title>
        <v-card-text>
          <v-list>
            <draggable group="group" :list="group.analysts">
              <v-list-item
                v-for="analyst in group.analysts"
                :key="analyst.id"
                @click="select"
              >
                {{ analyst.name }}
              </v-list-item>
            </draggable>
          </v-list>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12">
      <v-btn
        :disabled="groupData.name.length === 0"
        class="primary white--text"
        @click="save(group)"
      >
        {{ $t('save') }}
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import draggable from 'vuedraggable';

export default {
  components: {
    draggable,
  },
  props: {
    value: {
      type: Object,
      default: () => ({
        name: '',
        description: '',
        analysts: [],
      }),
    },
  },
  data() {
    return {
      search: '',
      groupData: {
        name: '',
        description: '',
        analysts: [],
      },
    };
  },
  computed: {
    analysts() {
      return this.$store.getters['analyst/getAnalysts'].filter((analyst) => analyst.name.toLowerCase().includes(this.search));
    },
    group() {
      return Object.assign(this.groupData, this.value);
    },
  },
  methods: {
    save(group) {
      this.$emit('input', group);
    },
    select() {},
  },
};
</script>

<style></style>
