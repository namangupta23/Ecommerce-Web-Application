const fs = require('fs');
const crypto = require("crypto")
const util = require("util")
const Repository = require("./repository.js")

const scrypt = util.promisify(crypto.scrypt);

class UsersRepository extends Repository {
    async create(attr) {
        attr.id = this.randomId();

        const salt = crypto.randomBytes(8).toString("hex")
        const buf = await scrypt(attr.password, salt, 64);

        const records = await this.getAll();
        const record = {
            ...attr,
            password: `${buf.toString("hex")}.${salt}`
        };

        records.push(record);
        await this.writeAll(records);
        return record;
    }

    async comparePasswords(saved, supplied) {
        const result = saved.split(".");
        const buf = await scrypt(supplied, result[1], 64);
        const hashed = buf.toString("hex");
        return hashed === result[0];
    }
}
module.exports = new UsersRepository("users.json");