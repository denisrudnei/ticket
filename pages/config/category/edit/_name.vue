<template>
  <div>
    <category-create v-model="category" editing @input="update" />
  </div>
</template>

<script>
import ggl from 'graphql-tag';
import CategoryCreate from '@/components/ticket/category/create';
import CategoryEditList from '@/graphql/query/config/category/edit.graphql';
import CategoryEdit from '@/graphql/mutation/config/category/editCategory.graphql';

export default {
  components: {
    CategoryCreate,
  },
  asyncData({ params, app }) {
    const { name } = params;
    return app.$apollo
      .query({
        query: ggl(CategoryEditList),
        variables: {
          name,
        },
      })
      .then((response) => ({
        category: response.data.category,
      }));
  },
  methods: {
    update(newValue) {
      this.$apollo
        .mutate({
          mutation: ggl(CategoryEdit),
          variables: {
            categoryId: newValue.id,
            category: {
              name: newValue.name,
              description: newValue.description,
              sla: newValue.sla.id,
              defaultGroup: newValue.defaultGroup.id,
              defaultStatus: newValue.defaultStatus.id,
              defaultPriority: newValue.defaultPriority.id,
            },
          },
          awaitRefetchQueries: true,
          refetchQueries: [
            {
              query: ggl(CategoryEditList),
              variables: {
                name: newValue.name,
              },
            },
          ],
        })
        .then(() => {
          this.$toast.show('Categoria atualizada', {
            duration: 5000,
            icon: 'done',
          });
          if (newValue.image) {
            const formData = new FormData();
            formData.append('image', newValue.image);
            this.$axios
              .post(`/config/category/image/${newValue.id}`, formData)
              .then(() => {
                this.$toast.show('Image uploaded', {
                  duration: 5000,
                  icon: 'done',
                });
              });
          }
          this.$router.push('/config/category');
        });
    },
  },
};
</script>

<style></style>
