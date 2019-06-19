import bluebird from "bluebird";
import * as redis from "redis";
import { logger } from "../configs/winston";

const client = redis.createClient();
client.set('key', 'value!', 'EX', 10);
client.on("error", e => {
  logger.error(`redis error : ${e}`);
});

bluebird.promisifyAll(client);

class UserCache {
  async store(user: any) {
    try {
      await client.hsetAsync("users:uuid", [
        user.uuid,
        JSON.stringify(user.toJSON())
      ]);
      await client.expire("users:uuid", 10)
    } catch (e) {
      // error 로깅
      logger.error(e);
    }
  }

  async find(uuid: string) {
    if (uuid) {
      try {
        return client.hgetAsync("users:uuid", uuid);
      } catch (e) {
        // error 로깅
        return null;
      }
    }
  }

}

export default UserCache;
