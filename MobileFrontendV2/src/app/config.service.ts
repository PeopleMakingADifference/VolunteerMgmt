import { Injectable } from '@angular/core';
import config from '../../ionic.config.json';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor() { }

  getEndpointUrl(): string {
    if (config.DEV_MODE === true) {
      return config.DEV_SERVER;
    }
    return config.PROD_SERVER;
  }

  xwwwurlencode(dataObject: any): string {
    // x-www-encoded expects key=value&key=value&key=value
    return Object.keys(dataObject)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(dataObject[key])}`)
      .join('&');
  }
}
