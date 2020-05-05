// Configuring Server:

const express = require('express');
const app = express();
const port = 8000;
const db = require('./data/db');
app.listen(port, () => console.log(`App is running on port: ${port}`));
app.use(express.json());
app.get('/', (req, res) => {
  res.json({ query: 'req.query', params: req.params, headers: req.headers });
});

// Functionality:
// Get request Handlers:
app.get('/api/posts', (req, res) => {
  db.find(req.query)
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ message: 'Error retrieving posts' });
    });
});
app.get('/api/posts/:id', (req, res) => {
  db.findById(req.params.id)
    .then((post) => {
      post
        ? res.status(200).json(post)
        : res.status(404).send({ message: "Post Doesn't Exist" });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: 'Error Retrieving Post' });
    });
});
app.get('/api/posts/:id/comments', (req, res) => {
  db.findPostComments(req.params.id)
    .then((comments) => {
      comments
        ? res.status(200).json({ data: comments })
        : res
            .status(404)
            .send({ message: 'Cannot Find Comments for this Post' });
    })
    .catch((err) => {
      console.error({ err });
      res.status(500).send({ message: 'Error Retrieving Comments' });
    });
});

// Post Request Handlers:
app.post('/api/posts/:id/comments', (req, res) => {
  db.insertComment(req.body)
    .then((comment) => {
      res.status(201).json(comment);
    })
    .catch((err) => {
      console.error({ err });
      res.status(500).send({ message: 'Error Adding Information' });
    });
});
app.post('/api/posts', (req, res) => {
  db.insert(req.body)
    .then((post) => {
      res.status(201).json(post);
    })
    .catch((err) => {
      console.error({ err });
      res.status(500).send({ message: 'Error Creating Post' });
    });
});

// Delete and update Handlers:
app.delete('/api/posts/:id', (req, res) => {
  db.remove(req.params.id)
    .then((count) => {
      if (count > 0) {
        res.status(200).send({ message: 'That Post has been Obliterated' });
      } else {
        res.status(404).send({ message: "That post couldn't be found" });
      }
    })
    .catch((err) => {
      console.error({ err });
      res.status(500).send({ message: 'Error Sending/Retrieving Information' });
    });
});
app.put('/api/posts/:id', (req, res) => {
  const changes = req.body;
  db.update(req.params.id, changes)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
        console.log(post);
      } else {
        res.status(404).send({ message: 'That Post Does Not Exist' });
      }
    })
    .catch((err) => {
      console.error({ err });
      res.status(500).send({ message: 'Error Sending Data' });
    });
});
