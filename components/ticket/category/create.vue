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
          placeholder="Nome"
          filled
        />
        <v-autocomplete
          v-model="category.defaultGroup"
          placeholder="Grupo principal"
          :items="groups.map(g => ({text: g.name, value: g}))"
          filled
        />
        <v-col
          cols="12"
        >
          <v-btn
            class="primary white--text"
            @click="addField()"
          >
            Acicionar campo
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
          Salvar
        </v-btn>
      </v-form>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'
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
      categoryData: {
        name: '',
        father: null,
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
    },
    ...mapGetters({
      groups: 'group/getGroups'
    })
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      this.$axios.get('/category').then(response => {
        this.categories = response.data
      })
    },
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
