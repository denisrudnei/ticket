<template>
  <create ref="create" v-model="knowledge" @change="save" />
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
  methods: {
    save(knowledge) {
      this.$axios.post('/knowledge', knowledge).then(response => {
        this.$toast.show('Criado documento de conhecimento', {
          duration: 5000,
          icon: 'done'
        })
        if (this.$refs.create.$refs.file.files.length > 0) {
          const formData = new FormData()
          formData.append('file', this.$refs.create.$refs.file.files[0])
          this.$axios
            .post(`/knowledge/${response.data._id}/file`, formData)
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
