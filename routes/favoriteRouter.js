const express = require('express');
const Favorite = require('../models/favorite');
const authenticate = require('../authenticate');
const cors = require('./cors'); //imported cors mod just created

const favoriteRouter = express.Router();

favoriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ user: req.user._id })
          .populate("user")
          .populate("campsites")
          .then((favorite) => {
            if (favorite) {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(favorite);
            } else {
              res.send("you do not have any favorites");
            }
          })
          .catch((err) => next(err));
      })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({
                user: req.user._id
            })
            .then((favorite) => {
                if (favorite) {
                    //looks to see if a favorite exists.
                    req.body.campsites.forEach((campsite) => {
                        //for each campsite that is in the body of the post.
                        //If not in my favorite - I add it to my favorites
                        if (!favorite.campsites.includes(campsite._id)) {
                            favorite.campsites.push(campsite);
                        }
                    });
                    favorite
                        .save()
                        .then((favorite) => {
                            res.statusCode = 200;
                            res.setHeader("Content-Type", "application/json");
                            res.json(favorite);
                        })
                        .catch((err) => next(err));
                } else {
                    //if I do not have a favorite yet it creates one
                    Favorite.create({
                        user: req.user._id,
                        campsites: req.body.campsites,
                    }).then((favorite) => {
                        res.json(favorite);
                    });
                }
            })
            .catch((err) => next(err));
    })
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {//put: add custom cors (cors.corsWithOptions)
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOneAndDelete({ user: req.user._id })
      .then((favorite) => {
        if (favorite) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(favorite);
        } else {
          res.statusCode = 200;
          res.setHeader("Content-Type", "text/plain");
          res.end("You do not have any favorites to delete");
        }
      })
      .catch((err) => next(err));
  });

favoriteRouter.route('/:campsiteId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /favorites');
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
      .then((favorite) => {
        if (favorite) {
          //looks to see if a favorite exists.
          //If not in my favorite - I add it to my favorites
          if (!favorite.campsites.includes(req.params.campsiteId)) {
            favorite.campsites.push(req.params.campsiteId);
            favorite
              .save()
              .then((favorite) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(favorite);
              })
              .catch((err) => next(err));
            //the user already has this listed in the favorite.
          } else {
            res.setHeader("Content-Type", "plain/text");
            res.end("That campsite is already in the list of favorites!");
          }
        } else {
            //if I do not have a favorite yet it creates one
            Favorite.create({
              user: req.user._id,
              campsites: [{_id:req.params.campsiteId}],
            }).then((favorite) => {
              res.json(favorite);
            });
          }
        })
        .catch((err) => next(err));
    })
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {//put: add custom cors (cors.corsWithOptions)
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
      .then((favorite) => {
        if (favorite) {
          const i = favorite.campsites.indexOf(req.params.campsiteId);
          if (i > -1) {
            favorite.campsites.splice(i, 1);
          }
          favorite
            .save()
            .then((favorite) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(favorite);
            })
            .catch((err) => next(err));
        } else {
          res.setHeader("Content-Type", "text/plain");
          res.end("You do not have any favorites to delete");
        }
      })
      .catch((err) => next(err));
  });

module.exports = favoriteRouter;
