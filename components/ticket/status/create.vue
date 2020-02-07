<template>
  <v-row>
    <v-col
      pa-3
      cols="12"
    >
      <v-text-field
        v-model="actual.name"
        placeholder="Nome"
        filled
      />
    </v-col>
    <v-col cols="12">
      <v-switch v-model="actual.slaRun" :label="$t('sla_able_to_run')" />
    </v-col>
    <v-col cols="6">
      <v-card>
        <v-card-title>
          <h4>Status disponíveis</h4>
        </v-card-title>
        <v-card-text>
          <v-list>
            <draggable group="status" :list="status">
              <v-list-item v-for="s in status" :key="s._id" @click="select">
                <v-list-item-content>
                  {{ s.name }}
                </v-list-item-content>
              </v-list-item>
            </draggable>
          </v-list>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="6">
      <v-card>
        <v-card-title>
          <h4>Próximo status possível</h4>
        </v-card-title>
        <v-card-text>
          <v-list>
            <draggable group="status" :list="actual.allowedStatus">
              <v-list-item v-for="s in actual.allowedStatus" :key="s._id" @click="select">
                {{ s.name }}
              </v-list-item>
            </draggable>
          </v-list>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col>
      <v-btn
        :disabled="actual.name.length === 0"
        class="primary white--text"
        @click="save()"  
      >
        {{ $t('save') }}
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import draggable from 'vuedraggable'
export default {
  components: {
    draggable
  },
  props: {
    value: {
      type: Object,
      default: () => {
        return {
          name: '',
          allowedStatus: []
        }
      }
    }
  },
  data() {
    return {
      status: [],
      actualData: {
        name: '',
        allowedStatus: [],
        slaRun: false
      }
    }
  },
  computed: {
    actual() {
      return Object.assign(this.actualData, this.value)
    }
  },
  created() {
    this.$axios.get('/status').then(response => {
      this.status = response.data
    })
  },
  methods: {
    select() {},
    save() {
      this.$emit('input', this.actualData)
    }
  }
}
</script>

<style>
</style>
