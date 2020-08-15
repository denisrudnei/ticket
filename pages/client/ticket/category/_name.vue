<template>
  <v-form ref="form">
    <v-row>
      <v-col cols="12">
        <h3>Categoria selecionada: {{ category.fullName }}</h3>
      </v-col>
      <v-col cols="12" md="4">
        <v-autocomplete
          v-model="ticket.affectedUser"
          @change="autoUpdateAddress"
          label="Chamado para"
          :rules="[(v) => !!v || 'Necessário preencher']"
          filled
          :items="
            analysts.map((a) => {
              return { text: a.name, value: a }
            })
          "
        />
      </v-col>
      <v-col cols="12" md="4">
        <v-autocomplete
          v-model="ticket.address"
          label="Endereço"
          clearable
          :rules="[(v) => !!v || 'Necessário preencher']"
          filled
          :items="
            addresses.map((a) => {
              return { text: a.name, value: a }
            })
          "
        />
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
          :value="category.defaultGroup.name"
          label="Grupo responsável"
          filled
          readonly
        />
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
          :value="category.defaultPriority.name"
          label="Prioridade"
          filled
          readonly
        />
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
          :value="category.defaultStatus.name"
          label="Status inicial"
          filled
          readonly
        />
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="ticket.resume"
          :rules="[(v) => !!v || 'Necessário']"
          filled
          placeholder="Descrição do chamado"
        />
      </v-col>
      <v-col cols="12">
        <v-textarea
          v-model="ticket.content"
          placeholder="Conteúdo"
          filled
          :rules="[(v) => !!v || 'Necessário']"
        />
      </v-col>
      <v-col cols="12">
        <v-btn @click="save">
          Enviar
          <v-icon>
            save
          </v-icon>
        </v-btn>
      </v-col>

      <v-tabs show-arrows>
        <v-tab>
          Campos
        </v-tab>
        <v-tab-item>
          <v-col v-for="field in category.fields" :key="field.id" cols="12">
            <v-text-field :placeholder="field.text" v-model="field.value" filled />
          </v-col>
        </v-tab-item>
        <v-tab>
          {{ $t('add_file') }}
        </v-tab>
        <v-tab-item>
          <file />
        </v-tab-item>
      </v-tabs>
    </v-row>
  </v-form>
</template>

<script>
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import { mapGetters } from 'vuex';
import ggl from 'graphql-tag';
import createTicket from '@/graphql/mutation/client/ticket/createTicket.graphql';
import category from '@/graphql/query/client/ticket/category.graphql';
import list from '@/graphql/query/client/ticket/searchTicket.graphql';
import file from './file';

export default {
  layout: 'client',
  components: {
    file,
  },
  data() {
    return {
      ticket: {},
    };
  },
  computed: mapGetters({
    user: 'auth/getUser',
  }),
  created() {
    this.ticket.fields = this.category.fields;
  },
  asyncData({ app, params }) {
    return app.$apollo
      .query({
        query: ggl(category),
        variables: {
          name: params.name,
        },
      })
      .then((response) => ({
        category: response.data.category,
        analysts: response.data.analyst,
        addresses: response.data.addresses,
        ticket: {
          group: response.data.category.defaultGroup,
          status: response.data.category.defaultStatus,
          priority: response.data.category.defaultPriority,
        },
      }));
  },
  methods: {
    addFile() {},
    invalid() {
      const fieldsWithId = ['affectedUser', 'group', 'status', 'priority'];
      const fields = ['resume', 'content'];
      for (const index in fields) {
        const field = fields[index];
        if (!Object.prototype.hasOwnProperty.call(this.ticket, field)) {
          return true;
        }
      }
      for (const index in fieldsWithId) {
        const field = fieldsWithId[index];
        if (!Object.prototype.hasOwnProperty.call(this.ticket, field)) return true;

        if (!Object.prototype.hasOwnProperty.call(this.ticket[field], 'id')) return true;
      }
      return false;
    },
    autoUpdateAddress() {
      if (!this.ticket.address && this.ticket.affectedUser) {
        this.ticket.address = this.ticket.affectedUser.address;
      }
    },
    save() {
      if (!this.$refs.form.validate() || this.invalid()) {
        this.$toast.show('Fonrceça as informções corretas', {
          duration: 5000,
          icon: 'error',
        });
        return;
      }
      this.$apollo
        .mutate({
          mutation: ggl(createTicket),
          variables: {
            ticket: {
              fields: this.ticket.fields.map((field) => {
                const { __typename, ...rest } = field;
                return rest;
              }),
              address: this.ticket.address.id,
              actualUser: this.user.id,
              group: this.ticket.group.id,
              status: this.ticket.status.id,
              priority: this.ticket.priority.id,
              category: this.category.id,
              resume: this.ticket.resume,
              content: this.ticket.content,
              affectedUser: this.ticket.affectedUser.id,
            },
          },
          awaitRefetchQueries: true,
          refetchQueries: [{
            query: ggl(list),
            variables: {
              page: 1,
              limit: 9,
              attributes: {
                openedBy: this.user.id,
              },
            },
          }],
        })
        .then(() => {
          this.$toast.show('Ticket enviado', {
            duration: 1000,
            icon: 'done',
          });
          this.$router.push('/client');
        }).catch(() => {
          this.$toast.error('Falha ao enviar chamado', {
            duration: 5000,
            icon: 'error',
          });
        });
    },
  },
};
</script>

<style></style>
