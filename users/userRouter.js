const express = require('express');

const db = require('./userDb.js');
const posts = require('../posts/postDb.js')

const router = express.Router();


router.post('/', validateUser, (req, res) => {
  // do your magic!
  const newUser = (req.body)
  console.log(newUser)
  db.insert(newUser)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(error => {
      res.status(500).json({ message: "Could not add user", error })
    })
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  // do your magic!
  posts.insert({ user_id: req.params.id, text: req.body.text })
    .then(post => {
      res.status(200).json({ message: post })
    })
    .catch(error => {
      res.status(500).json({ message: "Could not post", error })
    })
});

router.get('/', (req, res) => {
  db.get()
    .then(users => {
      res.status(200).json(users)
    })
    .catch(error => {
      res.status(500).json({ message: "Couldn't get from Data base", error })
    })
});

router.get('/:id', validateUserId, (req, res) => {
  res.status(200).json(req.user)
});

router.get('/:id/posts', validateUserId, (req, res) => {
  // do your magic!
  db.getUserPosts(req.user.id)
    .then(posts => {
      if (posts.length > 0) {
        res.status(200).json(posts);
      }
      else {
        res.status(400).json({ message: "This user has no posts" });
      }
    })
    .catch(error => {
      res.status(500).json({ message: "Couldn't get posts" })
    })
});

router.delete('/:id', validateUserId, (req, res) => {
  // do your magic!
  db.remove(req.user.id)
    .then(() => {
      res.status(200).json({ message: `user with id ${req.user.id} was removed` })
    })
    .catch(error => {
      res.status(500).json({ message: "Couldn't delete the user", error })
    })
});

router.put('/:id', validateUserId, validateUser, (req, res) => {
  // do your magic!
  db.update(req.user.id, { name: req.body.name })
    .then(() => {
      db.getById(req.user.id)
        .then(user => {
          res.status(200).json(user);
        })
        .catch(error => {
          res.status(500).json({ message: "Could not get updated user.", error });
        });
    })
    .catch(error => {
      res.status(500).json({ message: "Could not update user.", error });
    });
});

//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
  db.getById(req.params.id)
    .then(users => {
      if (users) {
        req.user = users;
        next();
      }
      else {
        res.status(500).json({ message: "No user with this ID exists" })
      }
    })
    .catch(error => {
      res.status(500).json({ message: "need to give an ID", error})
    })
}

function validateUser(req, res, next) {
  // do your magic!
  if (req.body) {
    if (req.body.name) {
      next();
    }
    else {
      res.status(400).json({ message: "Missing name" })
    }
  } else {
    res.status(400).json({ message: "Missing user data" })
  }
}

function validatePost(req, res, next) {
  // do your magic!
  if (req.body) {
    if (req.body.text) {
      next();
    } else {
      res.status(400).json({ message: "Missing required text field" });
    }
  } else {
    res.status(400).json({ message: "Missing post data" });
  }
}

module.exports = router;