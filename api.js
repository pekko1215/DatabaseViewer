const Router = require('express').Router;
const router = new Router;
const DBloader = require('./dbloader');

router.get('/v', (req, res, next) => {
    return res.json({ version: 1.23 })
})

router.get('/db', async (req, res, next) => {
    let tables = await DBloader.loadDBInfo();
    return res.json(tables.getDataValues());
})

router.put('/db/:table', async (req, res, next) => {
    const { table } = req.params;
    const { name } = req.body;
    const { DBModel } = DBloader;

    let t = DBModel.tables.find(tb => tb.physicsName === table);
    if (!t) return res.json({ error: 'Table is not found.' });


    if (name) await t.updateName(name);
    res.json({ ok: true })
})

router.put('/db/:table/:column', async (req, res, next) => {
    const { table, column } = req.params;
    const { name, comment } = req.body
    const { DBModel } = DBloader;

    console.log({ table, column, name })

    let t = DBModel.tables.find(tb => tb.physicsName === table);
    if (!t) return res.json({ error: 'Table is not found.' });
    let c = t.columns.find(cl => cl.physicsName === column);
    if (!c) return res.json({ error: 'Column is not found.' });



    if (name) await c.updateName(name)
    if (comment) await c.updateComment(comment)
    res.json({ ok: true })
})

module.exports = router;