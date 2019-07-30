<template>
  <create v-model="knowledge" @change="update" />
</template>

<script>
import create from '@/components/knowledge/create'
export default {
  components: {
    create
  },
  data() {
    return {
      knowledge: null
    }
  },
  asyncData({ $axios, params }) {
    return $axios.get(`/knowledge/view/${params.id}`).then(response => {
      return {
        knowledge: response.data
      }
    })
  },
  methods: {
    update(knowledge) {
      this.$axios
        .put(`/knowledge/${this.knowledge._id}`, knowledge)
        .then(() => {
          this.$toast.show('Atualizado', {
            duration: 5000,
            icon: 'done'
          })
        })
    }
  }
}
</script>

<style>
</style>
