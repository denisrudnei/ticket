<template>
  <v-row>
    <v-col>
      <v-card>
        <v-card-title>
          {{ group.name }}
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="6">
              {{ group.description }}
            </v-col>
            <v-col cols="6">
              <v-card>
                <v-card-title>
                  {{ $t('analysts') }}
                </v-card-title>
                <v-card-text>
                  <v-list two-line>
                    <v-list-item
                      v-for="analyst in group.analysts"
                      :key="analyst.id"
                      :to="`/analyst/${analyst.id}`"
                    >
                      <v-list-item-avatar>
                        <v-avatar>
                          <v-img :src="analyst.picture" />
                        </v-avatar>
                      </v-list-item-avatar>
                      <v-list-item-content>
                        {{ analyst.name }}
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import ggl from 'graphql-tag';
import getOneGroup from '@/graphql/query/config/group/getGroup.graphql';

export default {
  asyncData({ app, params }) {
    return app.$apollo.query({
      query: ggl(getOneGroup),
      variables: {
        id: params.id,
      },
    }).then((response) => ({
      group: response.data.group,
    }));
  },
};
</script>

<style>

</style>
