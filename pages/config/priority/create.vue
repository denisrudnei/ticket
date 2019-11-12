<template>
  <v-row>
    <v-col cols="6">
      <v-text-field v-model="priority.name" label="Texto" filled />
    </v-col>
    <v-col cols="6">      
      <v-text-field v-model="priority.weight" label="Peso" type="number" filled />
    </v-col>
    <v-col>
      <v-btn class="primary white--text" @click="save">
        {{ $t('save') }}
        <v-icon>
          save
        </v-icon>
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import ggl from 'graphql-tag'
import createPriority from '@/graphql/mutation/config/priority/createPriority.graphql'
import listPriority from '@/graphql/query/config/priority/priorityList.graphql'
export default {
  data() {
    return {
      priority: {
        name: '',
        weight: 0
      }
    }
  },
  methods: {
    save() {
      this.$apollo
        .mutate({
          mutation: ggl(createPriority),
          variables: {
            priority: {
              name: this.priority.name,
              weight: parseInt(this.priority.weight)
            }
          },
          refetchQueries: [{ query: ggl(listPriority) }]
        })
        .then(() => {
          this.$toast.show('Cadastrado', {
            duration: 1000,
            icon: 'done'
          })
        })
    }
  }
}
</script>

<style>
</style>
