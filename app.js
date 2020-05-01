#!/usr/bin/env node

const cli = require('cac')('dbview');

cli.command('run <uri>', `定義書の対象となるデータベースを、URI形式で指定します。`)
    .option('-p, --port <port>', 'Webサーバのポート番号を指定します')
    .option('--logging', 'SQL文のログを出力します')
    .action(async (uri, options) => {
        const Express = require('express');
        const App = Express();
        const DBLoader = require('./dbloader');
        const bodyParser = require('body-parser');
        const Models = require('./models');
        Models.sequelize.options.logging = options.logging ? console.log : false
        const Port = options.port || 8088;
        DBLoader.init(uri, { logging: options.logging });
        await DBLoader.loadDBInfo();

        App.use(bodyParser.json())
        App.use(Express.static('public'));
        App.use('/', require('./router'));
        App.listen(Port, () => {
            console.log(`Listen Server ${Port} and Connect Server ${process.argv[2]}`)
        });
    })
    .example(
        `  ${cli.name} run sqlite://dbtest.db\n` +
        `  ${cli.name} run postgres://user:pass@example.com:5432/dbname`)

cli.command('export <type>', '定義書データを標準出力にエクスポートします')
    .action(async (type) => {
        // 未実装
    })

cli.help()

cli.parse();