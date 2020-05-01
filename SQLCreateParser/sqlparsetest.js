var { parse } = require('node-sqlparser');
let sql = `
CREATE TABLE eating (
    id    INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    date  TEXT NOT NULL,
    name  TEXT,
    user  NUMERIC,
    FOREIGN KEY dwd(user) REFERENCES users(id)
)
`

console.log(sql)
let e = parse(sql);
console.log(JSON.stringify(e, null, 4))