import * as Promise from 'bluebird';
import * as Redis from 'redis';

declare module 'redis' {
  export interface RedisClient extends NodeJS.EventEmitter {
    hsetAsync(...args: any[]): Promise<any>;
    hgetAsync(...args: any[]): Promise<any>;
    // add other methods here
  }
}
