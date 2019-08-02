export default {
  methods: {
    compare(obj1, obj2) {
      if (obj1 === null || obj1 === undefined) return false
      if (obj2 === null || obj2 === undefined) return false
      ;[obj1, obj2].forEach(obj => {
        if (!Object.prototype.hasOwnProperty.call(obj, '_id')) return false
      })
      return obj1._id === obj2._id
    }
  }
}
