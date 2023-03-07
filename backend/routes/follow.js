const router = require("express").Router();
const FollowManager = require("../db_managers/followManager");

router.use((err, req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.send({
            statusCode: 403,
        });
    }
});

router.get("/count", async (req, res) => {
    try {
        const userId = req.query.userId;
        const numOfFollowers = await FollowManager.countFollowerOf(userId);
        const numOfFollowing = await FollowManager.countFollowingOf(userId);
        res.send({
            statusCode: 200,
            numOfFollowers: numOfFollowers,
            numOfFollowing: numOfFollowing
        });
    } catch (err) {
        console.log(err);
        res.send({
            statusCode: 500
        });
    }
});

router.get("/isFollowing", async (req, res) => {
    try {
        const followerId = req.query.followerId;
        const followedId = req.query.followedId;
        const isFollowing = await FollowManager.isFollowing(followerId, followedId);
        res.send({
            statusCode: 200,
            isFollowing: isFollowing
        });
    } catch (err) {
        console.log(err);
        res.send({
            statusCode: 500,
        });
    }
});

router.post("/follow", async (req, res) => {
    try {
        const followerId = req.body.followerId;
        const followedId = req.body.followedId;
        await FollowManager.follow(followerId, followedId);
        res.send({
            statusCode: 200,
        })
    } catch (err) {
        console.log(err);
        res.send({
            statusCode: 500,
        })
    }
});

router.post("/unfollow", async (req, res) => {
    try {
        const followerId = req.body.followerId;
        const followedId = req.body.followedId;
        await FollowManager.unfollow(followerId, followedId);
        res.send({
            statusCode: 200
        })
    } catch (err) {
        console.log(err);
        res.send({
            statusCode: 500,
        })
    }
})

router.get("/followedUsers", async (req, res) => {
    try {
        const docs = await FollowManager.getFollowedUsers(req.session.user._id);
        res.send({
            followedUsers: docs,
            statusCode: 200
        });
    } catch (err) {
        console.log(err);
        res.send({
            statusCode: 500
        });
    }
});

module.exports = router;