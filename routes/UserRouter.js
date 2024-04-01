const {Router} = require('express');
const {
    testRoute

} = require('../controllers/UserController');


const router = Router();

router.get('/test', testRoute);

module.exports = router;