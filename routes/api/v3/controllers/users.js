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
            "name": "Teresa Wang",
            "username": "twang85@uw.edu"
        }
    })
});

export default router;


// router.post('/signin', (req, res) => {

//   if(req.session.username){
//     res.send("Error: you are already logged in as " + req.session.userid )
//     return
//   }

//   // check username and password
//   if(req.body.username == "teresa" && req.body.password == "asdasd"){
//     req.session.userid = "kylethayer"
//     res.send("you logged in")
//   } else if(req.body.username == "anotheruser" && req.body.password == "pwd"){
//     req.session.userid = "anotheruser"
//     res.send("you logged in")
//   } else {
//     res.send("wrong login info")
//   }
// })

// router.post('/logout', (req, res) => {
//   req.session.destroy()
//   res.send("you are logged out")
// })

