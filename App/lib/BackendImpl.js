'use strict'

import CONFIG from './config'
import _ from 'underscore'
import Backend from './Backend'

export class BackendImpl extends Backend {

  initialize (token) {
    if (!_.isNull(token) && _.isUndefined(token.sessionToken)) {
      throw new Error('TokenMissing')
    }
    this._sessionToken =
      _.isNull(token) ? null : token.sessionToken.token

    this.API_BASE_URL = CONFIG.backend.hapiLocal
          ? CONFIG.HAPI.local.url
          : CONFIG.HAPI.remote.url
  }

  async login (data) {
    return await this._fetch({
      method: 'POST',
      url: 'auth/login',
      body: data
    })
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          return res.json
        } else {
          throw (res.json)
        }
      })
      .catch((error) => {
        throw (error)
      })
  }

  async getProfile () {
    return await this._fetch({
      method: 'GET',
      url: 'miperfil'
    })
      .then((res) => {
        if ((res.status === 200 || res.status === 201)) {
          return res.json
        } else {
          throw (res.json)
        }
      })
      .catch((error) => {
        throw (error)
      })
  }


  /**
   * ### _fetch
   * A generic function that prepares the request
   *
   * @returns object:
   *  {code: response.code,
   *   status: response.status,
   *   json: response.json()
   */
  async _fetch (opts) {
    opts = _.extend({
      method: 'GET',
      url: null,
      body: null,
      callback: null
    }, opts)

    var reqOpts = {
      method: opts.method,
      headers: {
      }
    }

    if (this._sessionToken) {
      reqOpts.headers['authorization'] = 'Bearer ' + this._sessionToken
    }

    if (opts.method === 'POST' || opts.method === 'PUT') {
      reqOpts.headers['Accept'] = 'application/json'
      reqOpts.headers['Content-Type'] = 'application/json'
    }

    if (opts.body) {
      reqOpts.body = JSON.stringify(opts.body)
    }

    let url = this.API_BASE_URL + opts.url
    let res = {}
    console.log("Request: " + reqOpts.method +  " " + url);
    console.log("Data: "  + reqOpts.body)

    let response = await fetch(url, reqOpts)
    res.status = response.status
    res.code = response.code

    return response.json()
      .then((json) => {
        console.log(json)
        res.json = json
        return res
      })
  }
}
// The singleton variable
export let backendImpl = new BackendImpl()
