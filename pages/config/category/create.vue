<template>
  <v-row>
    <v-col
      cols="12"
      pa-3
    >
      <v-form>
        <v-autocomplete
          v-model="category.father"
          :items="categoriesComputed"
          solo
          placeholder="Categoria pai"
        />
        <v-text-field
          v-model="category.name"
          placeholder="Nome"
          solo
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
                placeholder="Nome do campo"
                filled
              />
            </v-col>
            <v-col
              cols="2"
              pa-3
            >
              <v-text-field
                v-model="field.limits.min"
                filled
              />
            </v-col>
            <v-col
              cols="2"
              pa-3
            >
              <v-text-field
                v-model="field.limits.max"
                filled
              />
            </v-col>
            <v-col
              cols="12"
            >
              <v-checkfilled
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
export default {
  data() {
    return {
      categories: [],
      category: {
        name: '',
        father: null,
        fields: []
      }
    }
  },
  computed: {
    categoriesComputed() {
      return this.categories.map(c => ({ text: c.fullName, value: c }))
    }
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
      this.$axios.post('/config/category', this.category).then(() => {
        this.loadData()
        this.$toast.show('Categoria criada', {
          duration: 1000
        })
      })
    }
  }
}
</script>

<style>
</style>
