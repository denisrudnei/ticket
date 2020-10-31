<template>
  <div>
    <category-create
      v-model="category"
      editing
      @input="update"
    />
  </div>
</template>

<script>

import CategoryCreate from '@/components/ticket/category/create';
import CategoryEditList from '@/graphql/query/config/category/edit';
import CategoryEdit from '@/graphql/mutation/config/category/editCategory';

export default {
  components: {
    CategoryCreate,
  },
  asyncData({ params, app }) {
    const { name } = params;
    return app.apolloProvider.defaultClient
      .query({
        query: CategoryEditList,
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
          mutation: CategoryEdit,
          variables: {
            categoryId: newValue.id,
            category: {
              name: newValue.name,
              description: newValue.description,
              sla: newValue.sla.id,
              defaultGroup: newValue.defaultGroup.id,
              defaultStatus: newValue.defaultStatus.id,
              defaultPriority: newValue.defaultPriority.id,
              fields: newValue.fields.map((field) => {
                const { __typename, ...rest } = field;
                return rest;
              }),
            },
          },
          awaitRefetchQueries: true,
          refetchQueries: [
            {
              query: CategoryEditList,
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
