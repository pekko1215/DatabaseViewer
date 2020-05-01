const Sequelize = require('sequelize');
const Models = require('./models');

class DataBase {
    constructor(name, dbPath) {
        this.name = name;
        this.dbPath = dbPath;
        this.tables = [];
    }
    async init() {
        let { dataValues } = (await Models.databases.findOrCreate({
            where: {
                dbpath: this.dbPath
            },
            defaults: {
                comment: '',
                name: this.name,
                physicsName: this.name
            }
        }))[0]
        Object.assign(this, dataValues);
        return dataValues;
    }
    getDataValues() {
        return {
            name: this.name,
            dbPath: this.dbPath,
            comment: this.comment,
            physicsName: this.physicsName,
            tables: this.tables.map(t => t.getDataValues())
        }
    }
}

class Table {
    constructor(name, sql, dataBase) {
        this.physicsName = name;
        this.dataBase = dataBase;
        this.columns = [];
        this.comment = null;
        this.sql = sql;
    }
    async init() {
        let { dataValues } = (await Models.tables.findOrCreate({
            where: {
                databases: this.dataBase.id,
                physicsName: this.physicsName
            },
            defaults: {
                comment: '',
                name: this.physicsName
            }
        }))[0]
        Object.assign(this, dataValues);
        return dataValues;
    }
    async updateName(name) {
        this.name = name;
        return Models.tables.update({ name }, {
            where: {
                physicsName: this.physicsName,
                databases: this.dataBase.id
            }
        });
    }
    async updateComment(comment) {
        this.comment = comment;
        return Models.tables.update({ comment }, {
            where: {
                physicsName: this.physicsName,
                databases: this.dataBase.id
            }
        });
    }
    getDataValues() {
        return {
            name: this.name,
            physicsName: this.physicsName,
            comment: this.comment,
            sql: this.sql,
            columns: this.columns.map(c => c.getDataValues())
        }
    }
}
class Column {
    constructor(data, table) {
        this.physicsName = data.name;
        this.type = data.type;
        this.opts = data;
        this.table = table
        this.comment = null;
    }
    async init() {
        let { dataValues } = (await Models.columns.findOrCreate({
            where: {
                tables: this.table.id,
                physicsName: this.physicsName
            },
            defaults: {
                comment: '',
                name: this.physicsName
            }
        }))[0]
        Object.assign(this, dataValues);
        return dataValues;
    }
    async updateName(name) {
        this.name = name;
        return Models.columns.update({ name }, {
            where: {
                physicsName: this.physicsName,
                tables: this.table.id
            }
        });
    }
    async updateComment(comment) {
        this.comment = comment;
        return Models.columns.update({ comment }, {
            where: {
                physicsName: this.physicsName,
                tables: this.table.id
            }
        });
    }
    getDataValues() {
        return {
            name: this.name,
            physicsName: this.physicsName,
            type: this.type,
            opts: this.opts,
            comment: this.comment
        }
    }
}


module.exports = {
    async init(path, options = {}) {
        this.options = options;
        this.dbPath = path;
        this.sequelize = new Sequelize(path);
        this.sequelize.options.logging = options.logging ? console.log : false
        this.dialect = this.sequelize.options.dialect;
        this.host = this.sequelize.options.host;
    },
    async loadDBInfo() {
        try {
            await this.sequelize.authenticate();
            console.log('Connection has been established successfully.');
        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
        const DBModel = new DataBase(this.host, this.dbPath);
        await DBModel.init();
        for (let { name: tName, sql } of await this.getTableList()) {
            let table = new Table(tName, sql, DBModel);
            await table.init();
            DBModel.tables.push(table);
            for (let cName of await this.getColumnList(table.physicsName)) {
                // console.log({ cName, tName })
                let column = new Column(cName, table);
                await column.init();
                table.columns.push(column)
            }
        }
        this.DBModel = DBModel;
        return DBModel;
    },
    async getTableList() {
        let data;
        switch (this.dialect) {
            case 'sqlite':
                data = await this.sequelize
                    .query("select name,sql from sqlite_master where type = 'table';")
                break
            case 'mysql':
                data = await this.sequelize
                    .query("SELECT * FROM information_schema.TABLE WHERE TABLE_NAME;")
                break
        }
        return data[0].filter(d => d.name !== 'sqlite_sequence');
    },
    async getColumnList(table) {
        return (await this.sequelize
            .query(`PRAGMA table_info(${table})`))[0];
    }
}