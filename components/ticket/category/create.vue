<template>
  <v-form>
    <v-row>
      <v-col cols="8">
        <v-row>
          <v-col
            v-if="!editing"
            cols="12"
            md="4"
            pa-3
          >
            <v-autocomplete
              v-model="category.father"
              :items="categoriesComputed"
              :value-comparator="compare"
              filled
              placeholder="Categoria pai"
            />
          </v-col>
          <v-col
            cols="12"
            md="4"
            pa-3
          >
            <v-text-field
              v-model="category.name"
              :placeholder="this.$t('name')"
              filled
            />
          </v-col>
          <v-col
            cols="12"
            md="4"
            pa-3
          >
            <v-autocomplete
              v-model="category.defaultGroup"
              placeholder="Grupo principal"
              :value-comparator="compare"
              :items="groups.map((g) => ({ text: g.name, value: g }))"
              filled
            />
          </v-col>
          <v-col
            cols="12"
            md="4"
            pa-3
          >
            <v-autocomplete
              v-model="category.defaultStatus"
              placeholder="Status padrão"
              :value-comparator="compare"
              :items="status.map((s) => ({ text: s.name, value: s }))"
              filled
            />
          </v-col>
          <v-col
            cols="12"
            md="4"
            pa-3
          >
            <v-autocomplete
              v-model="category.sla"
              placeholder="SLA"
              :items="sla.map((s) => ({ text: s.name, value: s }))"
              :value-comparator="compare"
              filled
            />
          </v-col>
          <v-col
            cols="12"
            md="4"
            pa-3
          >
            <v-autocomplete
              v-model="category.defaultPriority"
              filled
              label="Prioridade padrão"
              :items="priority.map((p) => ({ text: p.name, value: p }))"
              :value-comparator="compare"
            />
          </v-col>
          <v-col cols="12">
            <v-textarea
              v-model="category.description"
              filled
              placeholder="Descrição"
            />
          </v-col>
          <v-col cols="12">
            <v-btn
              class="primary white--text"
              @click="addField()"
            >
              {{ $t('add_field') }}
            </v-btn>
          </v-col>
          <v-col
            cols="12"
            pa-3
          >
            <v-file-input
              v-model="category.image"
              placeholder="Arquivo"
              @change="updatePreview"
            />
          </v-col>
          <v-col cols="12">
            <v-row
              v-for="(field, index) in category.fields"
              :key="index"
            >
              <v-col
                cols="8"
                pa-3
              >
                <v-text-field
                  v-model="field.text"
                  label="Nome do campo"
                  filled
                />
              </v-col>
              <v-col
                cols="2"
                pa-3
              >
                <v-text-field
                  v-model="field.min"
                  label="Tamanho mínimo"
                  filled
                />
              </v-col>
              <v-col
                cols="2"
                pa-3
              >
                <v-text-field
                  v-model="field.max"
                  label="Tamanho máximo"
                  filled
                />
              </v-col>
              <v-col cols="12">
                <v-checkbox
                  v-model="field.required"
                  label="Necessário preencher?"
                />
              </v-col>
            </v-row>
          </v-col>
          <v-col pa-3>
            <v-btn
              class="primary white--text"
              @click="save()"
            >
              {{ $t('save') }}
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="4">
        <v-card
          tile
          class="primary"
        >
          <v-img
            :src="image"
            :aspect-ratio="16 / 9"
          />
          <v-card-title class="white--text">
            {{ category.name }}
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>

import create from '@/graphql/query/config/category/create';
import compareObjectsWithId from '@/mixins/compareObjectsWithId';

export default {
  mixins: [compareObjectsWithId],
  props: {
    value: {
      type: Object,
      default: () => ({}),
    },
    editing: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      image: '',
      categories: [],
      groups: [],
      status: [],
      priority: [],
      sla: [],
      categoryData: {
        name: '',
        father: null,
        defaultStatus: {},
        fields: [],
      },
    };
  },
  computed: {
    category() {
      return Object.assign(this.categoryData, this.value);
    },
    categoriesComputed() {
      return this.categories.map((c) => ({ text: c.fullName, value: c }));
    },
  },
  mounted() {
    this.$apollo
      .query({
        query: create,
      })
      .then((response) => {
        this.categories = response.data.category;
        this.groups = response.data.group;
        this.priority = response.data.priority;
        this.status = response.data.status;
        this.sla = response.data.sla;
      });
    if (this.category.id) {
      this.image = `/api/category/${this.category.id}/image`;
    }
  },
  methods: {
    updatePreview(file) {
      this.category.image = file;
      const fileReader = new FileReader();
      fileReader.addEventListener('loadend', () => {
        this.image = fileReader.result;
      });
      fileReader.readAsDataURL(file);
    },
    addField() {
      this.category.fields.push({
        text: '',
        required: false,
        min: 0,
        max: 50,
      });
    },
    save() {
      this.$emit('input', this.category);
    },
  },
};
</script>

<style></style>
