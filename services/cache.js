const mongoose = require("mongoose");
const exec = mongoose.Query.prototype.exec;
const redis = require("redis");
const util = require("util");
const client = redis.createClient("redis://127.0.0.1:6379");

mongoose.Query.prototype.cache = function(options = {}){
    this._cache = true;
    this._key = JSON.stringify(options.key || '');
    return this;
}

mongoose.Query.prototype.exec = async function(){
    if(!this._cache){
        return exec.apply(this, arguments);
    }

    const key = JSON.stringify(Object.assign({}, this.getQuery(), {
        collection: this.mongooseCollection.name
    }));

    client.hget = util.promisify(client.hget);
    const result = await client.hget(this._key, key);
    if(result){
        const cacheResult = JSON.parse(result);
        const doc = Array.isArray(cacheResult)? cacheResult.map(d => new this.model(d)): new this.model(cacheResult);
        return doc;
    }

    const dbResult = await exec.apply(this, arguments); // this = Query
    client.hset(this._key, key, JSON.stringify(dbResult));
    return dbResult;
}
module.exports = {
    clearCache(hashKey){
        client.del(JSON.stringify(hashKey));
    }
}