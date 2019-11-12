<template>
  <v-row>
    <v-col
      cols="12"
      pa-3
    >
      <v-form>
        <v-text-field
          v-model="analyst.name"
          :placeholder="$t('name')"
          filled
        />
        <v-text-field
          v-model="analyst.email"
          :placeholder="$t('name')"
          filled
        />
        <v-select
          v-model="analyst.group"
          :items="groups.map(g => { return { text: g.name, value: g } })"
          :placeholder="$t('group')"
          filled
          :label="$t('group')"
        />
        <v-btn
          class="primary white--text"
          @click="save"  
        >
          {{ $t('create') }}
        </v-btn>
      </v-form>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      groups: [],
      analyst: {
        name: '',
        email: '',
        group: ''
      }
    }
  },
  created() {
    this.$axios.get('/group').then(result => {
      this.groups = result.data
    })
  },
  methods: {
    save() {
      this.$axios.post('/config/analyst', this.analyst).then(() => {
        this.$toast.show('Criado novo analista', {
          duration: 1000
        })
      })
    }
  }
}
</script>

<style>
</style>
