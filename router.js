const Router = require('express').Router;
const router = new Router;

router.use('/api', require('./api'));



module.exports = router;