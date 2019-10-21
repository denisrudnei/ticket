<template>
  <v-app>
    <v-navigation-drawer fixed permanent app>
      <v-list>
        <v-list-item to="/client" exact>
          <v-list-item-action>
            <v-icon>home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            Página inicial
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/client/ticket/open">
          <v-list-item-action>
            <v-icon>book</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            Abrir chamado
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-content>
      <v-container fluid>
        <v-row no-gutters>
          <v-col cols="12">
            <nuxt />
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {}
</script>

<style>
</style>
