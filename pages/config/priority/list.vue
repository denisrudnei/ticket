<template>
  <v-row>
    <v-col cols="12">
      <v-list>
        <draggable v-model="items" :sort="true">
          <v-list-item v-for="item in items" :key="item._id" @click="dummy">
            <v-list-item-action>
              <v-btn class="primary white--text">
                <v-icon left>
                  priority_high
                </v-icon>
                {{ item.weight }}
              </v-btn>
            </v-list-item-action>
            <v-list-item-content>
              {{ item.name }}
            </v-list-item-content>
            <v-list-item-action>
              <v-btn icon class="primary white--text" :to="`/config/priority/edit/${item._id}`">
                <v-icon>
                  edit
                </v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </draggable>
      </v-list>
    </v-col>
    <v-col>
      <v-btn class="primary white--text" @click="update">
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
import draggable from 'vuedraggable'
import listPriority from '@/graphql/query/config/priority/priorityList.graphql'
import updateManyPriorities from '@/graphql/mutation/config/priority/updateManyPriorities.graphql'
export default {
  components: {
    draggable
  },
  data() {
    return {
      items: []
    }
  },
  computed: {
    priorityQuery() {
      return ggl(listPriority)
    }
  },
  watch: {
    items(value) {
      this.items.forEach((item, index) => {
        item.weight = this.items.length - index
      })
    }
  },
  mounted() {
    this.$apollo
      .query({
        query: ggl(listPriority)
      })
      .then(response => {
        this.items = response.data.priority.sort((a, b) => {
          if (a.weight < b.weight) {
            return 1
          }
          return -1
        })
      })
  },
  methods: {
    dummy() {},
    update() {
      this.items.forEach(p => {
        delete p.__typename
      })
      this.$apollo
        .mutate({
          mutation: ggl(updateManyPriorities),
          variables: {
            priorities: this.items
          },
          refetchQueries: [{ query: ggl(listPriority) }]
        })
        .then(() => {
          this.$toast.show('Atualizado', {
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
