<template>
  <v-row>
    <v-col
      cols="12"
      pa-3
    >
      <v-form>
        <v-autocomplete
          v-if="!editing"
          v-model="category.father"
          :items="categoriesComputed"
          filled
          placeholder="Categoria pai"
        />
        <v-text-field
          v-model="category.name"
          :placeholder="this.$t('name')"
          filled
        />
        <v-autocomplete
          v-model="category.defaultGroup"
          placeholder="Grupo principal"
          :items="groups.map(g => ({text: g.name, value: g}))"
          filled
        />
        <v-autocomplete
          v-model="category.defaultStatus"
          placeholder="Status padrão"
          :items="status.map(s => ({text: s.name, value: s}))"
          filled
        />
        <v-autocomplete
          v-model="category.defaultPriority"
          filled
          label="Prioridade padrão"
          :items="priority.map(p => ({text: p.name, value: p}))"
        />
        <v-col cols="12">
          <v-textarea v-model="category.description" filled placeholder="Descrição" />
        </v-col>
        <v-col
          cols="12"
        >
          <v-btn
            class="primary white--text"
            @click="addField()"
          >
            {{ $t('add_field') }}
          </v-btn>
        </v-col>
        <v-col
          cols="12"
        >
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
                v-model="field.limits.min"
                label="Tamanho mínimo"
                filled
              />
            </v-col>
            <v-col
              cols="2"
              pa-3
            >
              <v-text-field
                v-model="field.limits.max"
                label="Tamanho máximo"
                filled
              />
            </v-col>
            <v-col
              cols="12"
            >
              <v-checkbox
                v-model="field.required"
                label="Necessário preencher?"
              />
            </v-col>
          </v-row>
        </v-col>
        <v-btn
          class="primary white--text"
          @click="save()"
        >
          {{ $t('save') }}
        </v-btn>
      </v-form>
    </v-col>
  </v-row>
</template>

<script>
import ggl from 'graphql-tag'
import create from '@/graphql/query/config/category/create.graphql'
export default {
  props: {
    value: {
      type: Object,
      default: () => {
        return {}
      }
    },
    editing: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      categories: [],
      groups: [],
      status: [],
      priority: [],
      categoryData: {
        name: '',
        father: null,
        defaultStatus: {},
        fields: []
      }
    }
  },
  computed: {
    category() {
      return Object.assign(this.categoryData, this.value)
    },
    categoriesComputed() {
      return this.categories.map(c => ({ text: c.fullName, value: c }))
    }
  },
  mounted() {
    this.$apollo
      .query({
        query: ggl(create)
      })
      .then(response => {
        this.categories = response.data.category
        this.groups = response.data.group
        this.priority = response.data.priority
        this.status = response.data.status
      })
  },
  methods: {
    addField() {
      this.category.fields.push({
        text: '',
        required: false,
        limits: {
          min: 0,
          max: 50
        }
      })
    },
    save() {
      this.$emit('input', this.category)
    }
  }
}
</script>

<style>
</style>
