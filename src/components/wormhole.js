import Vue from 'vue'
import { freeze } from '../utils'
const transports = {}

export { transports }

export class Wormhole {
  constructor (transports) {
    this.transports = transports
  }

  open (transport) {
    const { to, from, passengers } = transport
    if (!to || !from || !passengers) return

    transport.passengers = freeze(passengers)
    const keys = Object.keys(this.transports)
    if (keys.includes(to)) {
      this.transports[to] = transport
    } else {
      Vue.set(this.transports, to, transport)
    }
  }

  close (transport, force = false) {
    const { to, from } = transport
    if (!to || !from) return
    if (this.transports[to] && (force || this.transports[to].from === from)) {
      this.transports[to] = undefined
    }
  }

  hasTarget (target) {
    return this.transports.hasOwnProperty(target)
  }

  getSourceFor (target) {
    return this.transports[target] || this.transports.from
  }

  getContentFor (target) {
    return this.transports[target] || this.transports.passengers
  }

}
const wormhole = new Wormhole(transports)
export default wormhole
