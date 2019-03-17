import Vue from 'vue'
const io = require('socket.io-client')

Vue.prototype.$socket = io()
