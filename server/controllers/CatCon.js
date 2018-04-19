const models = require('../models');

const Cat = models.Cat;
const Account = models.Account;

// serve the page for petting cats
const petCatPage = (req, res) => {
  Cat.CatModel.findRandom(req.session.account._id, (err, doc) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('pet', { csrfToken: req.csrfToken(), cat: doc });
  });
};

// get a random cat for petting purposes

const getRandomCat = (req, res) => {
  Cat.CatModel.findRandom(req.session.account._id, (err, doc) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ cat: doc });
  });
};


// pet cat
const petCat = (req, res) => {
  if (!req.body.catId || !req.session.account._id) {
    return res.status(400).json({ error: 'Missing param' });
  }
  return Cat.CatModel.findById(req.body.catId, (err, doc) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    const cat = doc;
    return Account.AccountModel.findById(cat.owner, (err2, doc2) => {
      const owner = doc2;

      owner.purrs++;
      cat.lastPlayer = req.session.account._id;
      cat.totalPets++;
      const ownerPromise = owner.save();
      ownerPromise.then(() => {
        const catPromise = cat.save();
        catPromise.then(() => res.json({ redirect: '/petCatPage' }));
      });
    });
  });
};

// serve the page for displaying user's cats
const myCatsPage = (req, res) => {
  Cat.CatModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.render('myCats', { csrfToken: req.csrfToken(), cats: docs });
  });
};

const getMyCats = (req, res) => {
  Cat.CatModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.json({ cats: docs });
  });
};
// give user a new cat
const adoptCat = (req, res) =>
    // if possible
    // pull down user data
    // check if purrs >= cats
    // purrs -= cats
    // cats++

   Account.AccountModel.findByUsername(
        req.session.account.username,
        () => {
          const catData = {
            breed: 'calico',
            owner: req.session.account._id,
          };

          const newCat = new Cat.CatModel(catData);

          const catPromise = newCat.save();

          catPromise.then(() => res.json({ redirect: '/myCatsPage' }));

          catPromise.catch((err) => {
            console.log(err);

            return res.status(400).json({ error: 'An error occurred' });
          });
        })
  // const checkPromise = Account.save();
  // checkPromise.then(() => checkPromise);
;


module.exports.petCatPage = petCatPage;
module.exports.getRandomCat = getRandomCat;
module.exports.petCat = petCat;
module.exports.myCatsPage = myCatsPage;
module.exports.getMyCats = getMyCats;
module.exports.adoptCat = adoptCat;

