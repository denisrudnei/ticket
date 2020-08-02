<template>
  <v-row>
    <v-col>
      <v-card>
        <v-card-title>
          {{ analyst.name }}
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="10">
              Email para contato {{ analyst.contactEmail }}
              <hr />
              Status: {{ analyst.status }}
              <hr />
              <v-card>
                <v-card-title>
                  {{$t('groups')}}
                </v-card-title>
                <v-card-text>
                  <v-list two-line>
                    <v-list-item
                      v-for="group in analyst.groups"
                      :key="group.id"
                      :to="`/search/group/${group.id}`"
                    >
                      {{ group.name }}
                    </v-list-item>
                  </v-list>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="2">
              <v-img :src="analyst.picture" />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn class="primary white--text" @click="show('openedBy', analyst)">
            Chamados abertos
          </v-btn>
          <v-btn
            class="primary white--text"
            @click="show('actualUser', analyst)"
          >
            Chamados sendo tratados
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import showModal from '@/mixins/showModal';
import AnalystById from '@/graphql/query/analyst/analystById.graphql';
import ggl from 'graphql-tag';

export default {
  mixins: [showModal],
  asyncData({ params, app }) {
    return app.$apollo
      .query({
        query: ggl(AnalystById),
        variables: {
          id: params.id,
        },
      })
      .then((response) => ({
        analyst: response.data.AnalystById,
      }));
  },
};
</script>

<style></style>
