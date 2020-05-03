<template>
  <div>
    <category-create v-model="category" editing @input="update" />
  </div>
</template>

<script>
import ggl from 'graphql-tag'
import CategoryCreate from '@/components/ticket/category/create'
import CategoryEditList from '@/graphql/query/config/category/edit.graphql'
import CategoryEdit from '@/graphql/mutation/config/category/editCategory.graphql'
export default {
  components: {
    CategoryCreate
  },
  asyncData({ params, app }) {
    const name = params.name
    return app.$apollo
      .query({
        query: ggl(CategoryEditList),
        variables: {
          name: name
        }
      })
      .then(response => {
        return {
          category: response.data.category
        }
      })
  },
  methods: {
    update(newValue) {
      this.$apollo
        .mutate({
          mutation: ggl(CategoryEdit),
          variables: {
            categoryId: newValue._id,
            category: {
              name: newValue.name,
              description: newValue.description,
              sla: newValue.sla._id,
              defaultGroup: newValue.defaultGroup._id,
              defaultStatus: newValue.defaultStatus._id,
              defaultPriority: newValue.defaultPriority._id
            }
          },
          refetchQueries: [
            {
              query: ggl(CategoryEditList),
              variables: {
                name: newValue.name
              }
            }
          ]
        })
        .then(() => {
          this.$toast.show('Categoria atualizada', {
            duration: 5000,
            icon: 'done'
          })
          if (newValue.image) {
            const formData = new FormData()
            formData.append('image', newValue.image)
            this.$axios
              .post(`/config/category/image/${newValue._id}`, formData)
              .then(() => {
                this.$toast.show('Image uploaded', {
                  duration: 5000,
                  icon: 'done'
                })
              })
          }
          this.$router.push('/config/category')
        })
    }
  }
}
</script>

<style>
</style>
