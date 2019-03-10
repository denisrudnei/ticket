<template>
  <v-layout
    row
    wrap
  >
    <v-flex
      xs12
    >
      <v-tabs>
        <v-tab>
          Incidente
        </v-tab>
        <v-tab-item>
          <v-tabs>
            <v-tab>Criar</v-tab>
            <v-tab-item>
              <ticket-create />
            </v-tab-item>
          </v-tabs>
        </v-tab-item>
        <v-tab>Analista</v-tab>
        <v-tab-item>
          <v-tabs>
            <v-tab>Criar</v-tab>
            <v-tab-item>
              <analyst-create />
            </v-tab-item>
            <v-tab>Listar</v-tab>
            <v-tab-item>
              <analyst-list />
            </v-tab-item>
          </v-tabs>
        </v-tab-item>
        <v-tab>Categorias</v-tab>
        <v-tab-item>
          <v-tabs>
            <v-tab>Criar</v-tab>
            <v-tab-item>
              <category-create />
            </v-tab-item>
            <v-tab>Listar</v-tab>
            <v-tab-item>
              <category-list />
            </v-tab-item>
          </v-tabs>
        </v-tab-item>
        <v-tab>Grupos</v-tab>
        <v-tab-item>
          <v-tabs>
            <v-tab>Criar</v-tab>
            <v-tab-item>
              <group-create />
            </v-tab-item>
            <v-tab>Listar</v-tab>
            <v-tab-item>
              <group-list />
            </v-tab-item>
          </v-tabs>
        </v-tab-item>
        <v-tab>Status</v-tab>
        <v-tab-item>
          <v-tabs>
            <v-tab>Criar</v-tab>
            <v-tab-item>
              <status-create />
            </v-tab-item>
            <v-tab>Listar</v-tab>
            <v-tab-item>
              <status-list />
            </v-tab-item>
          </v-tabs>
        </v-tab-item>
      </v-tabs>
    </v-flex>
    <v-flex
      xs12
    >
      <nuxt />
    </v-flex>
  </v-layout>
</template>

<script>
import TicketCreate from './ticket/create'
import CategoryCreate from './config/category/create'
import CategoryList from './config/category/index'
import AnalystCreate from './config/analyst/create'
import AnalystList from './config/analyst/index'
import GroupCreate from './config/group/create'
import GroupList from './config/group/index'
import StatusCreate from './config/status/create'
import StatusList from './config/status/index'

export default {
  components: {
    TicketCreate,
    CategoryCreate,
    CategoryList,
    AnalystCreate,
    AnalystList,
    GroupCreate,
    GroupList,
    StatusCreate,
    StatusList
  }
}
</script>

<style>
</style>
