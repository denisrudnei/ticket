<template>
  <v-layout
    row
    wrap
  >
    <v-flex
      xs12
      pa-2
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
        <v-flex
          xs12
        >
          <v-btn
            @click="addField()"
          >
            Acicionar campo
          </v-btn>
        </v-flex>
        <v-flex
          xs12
        >
          <v-layout
            v-for="(field, index) in category.fields"
            :key="index"
            row
            wrap
          >
            <v-flex
              xs8
              pa-2
            >
              <v-text-field
                v-model="field.name"
                placeholder="Nome do campo"
                box
              />
            </v-flex>
            <v-flex
              xs2
              pa-2
            >
              <v-text-field
                v-model="field.limits.min"
                box
              />
            </v-flex>
            <v-flex
              xs2
              pa-2
            >
              <v-text-field
                v-model="field.limits.max"
                box
              />
            </v-flex>
            <v-flex
              xs12
            >
              <v-checkbox
                v-model="field.required"
                label="Necessário preencher?"
              />
            </v-flex>
          </v-layout>
        </v-flex>

        <v-btn @click="save()">
          Salvar
        </v-btn>
      </v-form>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      categories: [],
      category: {
        name: '',
        father: {},
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
      this.$axios.get('api/category').then(response => {
        this.categories = response.data
      })
    },
    addField() {
      this.category.fields.push({
        name: '',
        required: false,
        limits: {
          min: 0,
          max: Number.MAX_SAFE_INTEGER
        }
      })
    },
    save() {
      this.$axios.post('api/category', this.category).then(() => {
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
