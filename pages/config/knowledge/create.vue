<template>
  <create ref="create" v-model="knowledge" @change="save" />
</template>

<script>
import create from '@/components/knowledge/create'
import CreateKnowledge from '@/graphql/mutation/config/knowledge/create.graphql'
import ggl from 'graphql-tag'
export default {
  components: {
    create
  },
  data() {
    return {
      knowledge: null
    }
  },
  methods: {
    save(knowledge) {
      this.$apollo
        .mutate({
          mutation: ggl(CreateKnowledge),
          variables: {
            knowledge
          }
        })
        .then(response => {
          this.$toast.show('Criado documento de conhecimento', {
            duration: 5000,
            icon: 'done'
          })
          if (this.$refs.create.$refs.file.files.length > 0) {
            const formData = new FormData()
            formData.append('file', this.$refs.create.$refs.file.files[0])
            this.$axios
              .post(
                `/knowledge/${response.data.CreateKnowledge.id}/file`,
                formData
              )
              .then(() => {
                this.$toast.show('Documento enviado com sucesso', {
                  duration: 5000,
                  icon: 'done'
                })
              })
          }
        })
    }
  }
}
</script>

<style>
</style>
