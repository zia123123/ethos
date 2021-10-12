const { regionals } = require('../models/index');

module.exports = {

    show(req, res, next) {
        if(regionals.isRegionalQa(req.users)) {
            next();
        } else {
            res.status(401).json({ msg: "Akses Di tolak, Pastikan User Group Benar" });
        }
    },

    // update(req, res, next) {
    //     if(req.users.id === req.post.userId  || User.isAdmin(req.users.roles)) {
    //         next();
    //     } else {
    //         res.status(401).json({ msg: "Akses Di tolak, Pastikan User Group Benar" });
    //     }
    // },

    // delete(req, res, next) {
    //     if(req.users.id === req.post.userId  || User.isAdmin(req.users.roles)) {
    //         next();
    //     } else {
    //         res.status(401).json({ msg: "Akses Di tolak, Pastikan User Group Benar" });
    //     }
    // }

}