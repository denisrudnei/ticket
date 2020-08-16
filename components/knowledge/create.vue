<template>
  <v-row>
    <v-col
      cols="12"
      pa-3
    >
      <v-text-field
        v-model="knowledgeData.name"
        filled
        label="Nome do documento"
      />
    </v-col>
    <v-col
      cols="12"
      md="4"
      pa-3
    >
      <v-select
        v-model="knowledge.status"
        filled
        :value-comparator="compare"
        placeholder="Status do documento"
        :items="status.map((v) => ({ text: v.name, value: v }))"
      />
    </v-col>
    <v-col
      cols="12"
      md="4"
      pa-3
    >
      <v-select
        v-model="knowledge.category"
        filled
        :value-comparator="compare"
        placeholder="Categoria do problema"
        :items="category.map((v) => ({ text: v.name, value: v }))"
      />
    </v-col>
    <v-col
      cols="12"
      md="4"
      pa-3
    >
      <v-select
        v-model="knowledge.group"
        filled
        :value-comparator="compare"
        :items="group.map((v) => ({ text: v.name, value: v }))"
        placeholder="Grupo responsável"
      />
    </v-col>
    <v-col
      cols="12"
      pa-3
    >
      <client-only>
        <ckeditor
          v-model="knowledge.description"
          :editor="editor"
          @ready="configureEditor"
        />
      </client-only>
      <input
        ref="file"
        type="file"
        style="display: none;"
      >
      <v-btn
        class="primary white--text"
        @click="addFile()"
      >
        <v-icon>attach_file</v-icon>
        {{ $t('add_file') }}
      </v-btn>
      <v-btn
        tile
        :disabled="disabled"
        class="primary white--text"
        @click="save()"
      >
        {{ $t('save') }}
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import compareObjectsWithId from '@/mixins/compareObjectsWithId';
import ImageUploadAdapter from '@/plugins/image-upload-adapter';
import create from '@/graphql/query/config/knowledge/create.graphql';
import ggl from 'graphql-tag';

export default {
  mixins: [compareObjectsWithId],
  props: {
    value: {
      type: Object,
      default: () => ({
        name: '',
        description: '',
        group: '',
        category: '',
      }),
    },
  },
  data() {
    return {
      editor: null,
      items: [],
      status: [],
      category: [],
      group: [],
      knowledgeData: {
        name: '',
        description: '',
        group: '',
        category: '',
      },
    };
  },
  computed: {
    knowledge() {
      return Object.assign(this.knowledgeData, this.value);
    },
    disabled() {
      return (
        this.knowledge.name === ''
        || this.knowledge.description === ''
        || this.knowledge.category === ''
        || this.knowledge.group === ''
      );
    },
  },
  created() {
    this.$apollo
      .query({
        query: ggl(create),
      })
      .then((response) => {
        this.status = response.data.status;
        this.group = response.data.group;
        this.category = response.data.category;
      });
  },
  mounted() {
    this.editor = require('@ckeditor/ckeditor5-build-classic');
  },
  methods: {
    save() {
      this.$emit('change', this.knowledge);
    },
    addFile() {
      this.$refs.file.click();
    },
    configureEditor(editor) {
      editor.plugins.get('FileRepository').createUploadAdapter = (loader) => new ImageUploadAdapter(loader, this.$axios);
    },
  },
};
</script>

<style></style>
