export default {
  methods: {
    show(property, value) {
      if (value === null || value === undefined) return;
      if (Object.prototype.hasOwnProperty.call(value, 'id')) {
        this.$store.commit('ticket/setModalQuery', {
          [property]: value.id,
        });
        this.$store.commit('ticket/setModalList', true);
      }
    },
  },
};
