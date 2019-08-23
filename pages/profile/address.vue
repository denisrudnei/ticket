<template>
  <v-row>
    <v-col
      cols="12"
      md="8"
      pa-3
    >
      <v-row>
        <v-col
          cols="12"
          md="4"
          pa-3
        >
          <v-text-field
            v-model="address.cep"
            mask="#####-###"
            label="Cep"
            filled
          />
        </v-col>
        <v-col
          md="4"
          cols="12"
          pa-3
        >
          <v-autocomplete
            v-model="address.city"
            filled
            label="Cidade"
          />
        </v-col>
        <v-col
          md="4"
          cols="12"
          pa-3
        >
          <v-autocomplete
            v-model="address.state"
            filled
            label="Estado"
          />
        </v-col>
        <v-col
          cols="12"
          pa-3
        >
          <v-text-field
            v-model="address.street"
            filled
            label="Rua"
          />
        </v-col>
      </v-row>
    </v-col>
    <v-col
      md="4"
      cols="12"
      pa-3
    >
      <gmap-autocomplete />
      <v-btn
        icon
        class="primary white--text"
        @click="addMarker"
      >
        <v-icon>
          add
        </v-icon>
      </v-btn>
      <gmap-map
        ref="gmap"
        :center="center"
        :zoom="12"
        style="width:100%;  height: 400px;"
        @center_changed="updateCenter"
      >
        <gmap-marker
          v-for="(m, index) in markers"
          :key="index"
          :position="m.position"
          @click="center=m.position"
        />
      </gmap-map>
    </v-col>
    <v-col
      cols="12"
      pa-3
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
    </v-col>
  </v-row>
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
    setPlace(place) {
      this.currentPlace = place
    },
    addMarker() {
      if (this.currentPlace) {
        const marker = {
          lat: this.currentPlace.geometry.location.lat(),
          lng: this.currentPlace.geometry.location.lng()
        }
        this.markers.push({ position: marker })
        this.places.push(this.currentPlace)
        this.center = marker
        this.currentPlace = null
      }
    },
    updateCenter(center) {},
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
