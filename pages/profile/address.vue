<template>
  <v-layout
    row
    wrap
  >
    <v-flex
      xs8
      pa-2
    >
      <v-layout
        row
        wrap
      >
        <v-flex
          xs4
          pa-2
        >
          <v-text-field
            v-model="address.cep"
            mask="#####-###"
            label="Cep"
            box
          />
        </v-flex>
        <v-flex
          xs4
          pa-2
        >
          <v-autocomplete
            v-model="address.city"
            box
            label="Cidade"
          />
        </v-flex>
        <v-flex
          xs4
          pa-2
        >
          <v-autocomplete
            v-model="address.state"
            box
            label="Estado"
          />
        </v-flex>
        <v-flex
          xs12
          pa-2
        >
          <v-text-field
            v-model="address.street"
            box
            label="Rua"
          />
        </v-flex>
      </v-layout>
    </v-flex>
    <v-flex
      xs4
      pa-2
    >
      <gmap-autocomplete />
      <gmap-map
        :center="center"
        :zoom="12"
        style="width:100%;  height: 400px;"
      >
        <gmap-marker
          v-for="(m, index) in markers"
          :key="index"
          :position="m.position"
          @click="center=m.position"
        />
      </gmap-map>
    </v-flex>
    <v-flex
      xs12
      pa-2
    >
      <v-btn
        class="primary white--text"
        @click="save()"
      >
        <v-icon
          left
        >
          save
        </v-icon>
        Salvar
      </v-btn>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      address: {},
      center: { lat: 45.508, lng: -73.587 },
      markers: [],
      places: [],
      currentPlace: null
    }
  },
  computed: mapGetters({
    user: 'auth/getUser'
  }),
  created() {
    this.$axios.get('/profile/address').then(response => {
      if (!response.data) {
        this.address = {
          cep: '',
          city: '',
          street: '',
          state: ''
        }
      } else {
        this.address = response.data
      }
    })
  },
  mounted() {
    navigator.geolocation.getCurrentPosition(info => {
      this.center = {
        lat: info.coords.latitude,
        lng: info.coords.longitude
      }
    })
  },
  methods: {
    save() {
      this.$axios.post('/address', this.address).then(
        () => {
          this.$toast.show('Atualizado com sucesso', {
            duration: 1000,
            icon: 'done'
          })
        },
        () => {
          this.$toast.error('Falha ao cadastrar/inseir', {
            duration: 1000,
            icon: 'error'
          })
        }
      )
    }
  }
}
</script>

<style>
</style>
