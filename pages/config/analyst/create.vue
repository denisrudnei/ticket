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
          :placeholder="$t('email')"
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
import GroupList from '@/graphql/query/group/list.graphql'
import CreateAnalyst from '@/graphql/mutation/config/analyst/create.graphql'
import ggl from 'graphql-tag'
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
    this.$apollo
      .query({
        query: ggl(GroupList)
      })
      .then(result => {
        this.groups = result.data.Group
      })
  },
  methods: {
    save() {
      this.$apollo
        .mutate({
          mutation: ggl(CreateAnalyst),
          variables: {
            analyst: this.analyst
          }
        })
        .then(() => {
          this.$toast.show('Criado novo analista', {
            duration: 1000
          })
        })
        .catch(() => {
          this.$toast.error(this.$t('failed_to_create_new_analyst'), {
            duration: '5000',
            icon: 'error'
          })
        })
    }
  }
}
</script>

<style>
</style>
