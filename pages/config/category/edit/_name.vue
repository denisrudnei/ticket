<template>
  <category-create v-model="category" editing @input="update" />
</template>

<script>
import CategoryCreate from '@/components/ticket/category/create'
export default {
  components: {
    CategoryCreate
  },
  asyncData({ params, $axios }) {
    const name = params.name
    return $axios.get(`/category/${name}`).then(response => {
      return {
        category: response.data
      }
    })
  },
  methods: {
    update(category) {
      this.$axios.put(`/category/${category._id}`, category).then(() => {
        this.$toast.show('Categoria atualizada', {
          duration: 5000,
          icon: 'done'
        })
        this.$router.push('/config/category')
      })
    }
  }
}
</script>

<style>
</style>
