import express from 'express';
var router = express.Router();

/* GET users listing. */
router.get('/myIdentity', function(req, res) {
    const session = req.session;

    if(!session || !session.isAuthenticated){
        return res.json({status: "loggedout" })
    }

    const {name, username} = session.account;

    return res.json({
        "status": "loggedin",
        "userInfo":{
            "name": session.account.name,
            "username": session.account.username
        }
    })
});

export default router;