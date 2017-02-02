'use strict'
var base64 = require('base-64');

export default function decodeJwt(token) {
      if (!token) {
        throw new Error('No token supplied');
      }
      var segments = token.split('.');
      if (segments.length !== 3) {
        throw new Error('Not enough or too many segments');
      }

      var headerSeg = segments[0];
      var payloadSeg = segments[1];
      var signatureSeg = segments[2];
      var payload = JSON.parse(base64.decode(payloadSeg));
      return payload;
}
