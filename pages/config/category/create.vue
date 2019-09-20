<template>
  <category-create @input="save" />
</template>

<script>
import CategoryCreate from '@/components/ticket/category/create'
export default {
  components: {
    CategoryCreate
  },
  methods: {
    save(category) {
      this.$axios.post('/config/category', category).then(() => {
        this.$toast.show('Categoria criada', {
          duration: 1000
        })
        this.$router.push('/config/category')
      })
    }
  }
}
</script>

<style>
</style>
