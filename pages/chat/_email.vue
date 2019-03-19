<template>
  <v-layout
    row
    wrap
  >
    <v-flex
      xs12
      pa-2
    >
      <v-timeline>
        <v-timeline-item
          v-for="(c, index) in chat"
          :key="index"
          :left="current === c.name"
          :right="current !== c.name"
          hide-dot
        >
          <v-card>
            <v-card-title>
              <v-avatar>
                <v-img
                  :src="c.picture"
              />
              </v-avatar>
              <v-flex
                pa-2
              >
                {{ c.name }}
              </v-flex>
            </v-card-title>
            <v-card-text>
              {{ c.content }}
            </v-card-text>
          </v-card>
        </v-timeline-item>
        <v-textarea
          v-model="content"
          box
          placeholder="Insira um texto"
          @keydown.enter="add()"
        />
      </v-timeline>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      content: '',
      current: 'teste@teste.com',
      chat: [
        {
          name: 'teste@teste.com',
          content: 'Olá',
          picture:
            'https://s.gravatar.com/avatar/2f4a6d2cabf58abf591dfe84dd3cd846?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fde.png'
        },
        {
          name: 'outro@teste.com',
          content: 'Olá, em que posso ajudar?',
          picture:
            'https://x1.xingassets.com/assets/frontend_minified/img/users/nobody_m.original.jpg'
        },
        {
          name: 'teste@teste.com',
          content: 'nada não, só estava testando o chat',
          picture:
            'https://s.gravatar.com/avatar/2f4a6d2cabf58abf591dfe84dd3cd846?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fde.png'
        }
      ]
    }
  },
  methods: {
    add() {
      this.chat.push({
        name: 'teste@teste.com',
        picture:
          'https://s.gravatar.com/avatar/2f4a6d2cabf58abf591dfe84dd3cd846?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fde.png',
        content: this.content
      })
      this.content = ''
    }
  }
}
</script>

<style>
</style>
