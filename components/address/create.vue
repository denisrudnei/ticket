<template>
  <v-row>
    <v-col
      cols="12"
      md="8"
      pa-3
    >
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="address.name"
            :label="$t('name')"
            filled
          />
        </v-col>
        <v-col
          cols="12"
          md="4"
          pa-3
        >
          <v-text-field
            v-model="address.cep"
            v-mask="mask"
            label="Cep"
            filled
          />
        </v-col>
        <v-col
          md="4"
          cols="12"
          pa-3
        >
          <v-text-field
            v-model="address.country"
            filled
            label="País"
          />
        </v-col>
        <v-col
          md="4"
          cols="12"
          pa-3
        >
          <v-text-field
            v-model="address.state"
            filled
            label="Estado"
          />
        </v-col>
        <v-col
          md="4"
          cols="12"
          pa-3
        >
          <v-text-field
            v-model="address.city"
            filled
            label="Cidade"
          />
        </v-col>
        <v-col
          cols="12"
          md="8"
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
        style="width: 100%; height: 400px;"
        @center_changed="updateCenter"
      >
        <gmap-marker
          v-for="(m, index) in markers"
          :key="index"
          :position="m.position"
          @click="center = m.position"
        />
      </gmap-map>
    </v-col>
    <v-col
      cols="12"
      pa-3
    >
      <v-btn
        class="primary white--text"
        :disabled="disabled"
        @click="save()"
      >
        <v-icon left>
          save
        </v-icon>
        {{ $t('save') }}
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import { mask } from 'vue-the-mask';
import { mapGetters } from 'vuex';

export default {
  directives: {
    mask,
  },
  props: {
    value: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      mask: '#####-###',
      addressData: {
        cep: '',
        name: '',
        city: '',
        state: '',
        country: '',
        street: '',
      },
      center: { lat: 45.508, lng: -73.587 },
      markers: [],
      places: [],
      currentPlace: null,
    };
  },
  computed: {
    disabled() {
      return (
        Object.values(this.address).filter((v) => v === '').length > 0
      );
    },
    address() {
      return Object.assign(this.addressData, this.value);
    },
    user() {
      return this.$auth.user;
    },
  },
  mounted() {
    navigator.geolocation.getCurrentPosition((info) => {
      this.center = {
        lat: info.coords.latitude,
        lng: info.coords.longitude,
      };
    });
  },
  methods: {
    setPlace(place) {
      this.currentPlace = place;
    },
    addMarker() {
      if (this.currentPlace) {
        const marker = {
          lat: this.currentPlace.geometry.location.lat(),
          lng: this.currentPlace.geometry.location.lng(),
        };
        this.markers.push({ position: marker });
        this.places.push(this.currentPlace);
        this.center = marker;
        this.currentPlace = null;
      }
    },
    updateCenter(center) {},
    save() {
      this.$emit('input', this.address);
    },
  },
};
</script>

<style></style>
