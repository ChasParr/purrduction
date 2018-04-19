const models = require('../models');

const Account = models.Account;

const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};


const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

// login to existing account
const login = (request, response) => {
  const req = request;
  const res = response;

  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(400).json({ error: 'Wrong username or password' });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/petCatPage' });
  });
};

const changePassPage = (req, res) => {
  res.render('pass', { csrfToken: req.csrfToken() });
};

// change password
const changePass = (request, response) => {
  const req = request;
  const res = response;

  req.body.oldPass = `${req.body.oldPass}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.oldPass || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  console.log(req.session.account.username);
  console.dir(req.body.oldPass);
  console.dir(req.body.pass);
  console.dir(req.body.pass2);

  return Account.AccountModel.authenticate(
      req.session.account.username,
      req.body.oldPass,
      (err, account) => {       // callback func
        if (err || !account) {
          return res.status(400).json({ error: 'Wrong password' });
        }

        const newAccount = account;

        return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
          newAccount.password = hash;
          newAccount.salt = salt;

          const savePromise = newAccount.save();

          savePromise.then(() => res.json({ redirect: '/changePass' }));

            // if error
          savePromise.catch((error) => {
            console.log(error);
            return res.status(400).json({ error: 'An error occurred.' });
          });
        });
      });
};

const signup = (request, response) => {
  const req = request;
  const res = response;

  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };

    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      console.log(req.session.account);
      return res.json({ redirect: '/petCatPage' });
    });

    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already in use.' });
      }

      return res.status(400).json({ error: 'An error occurred.' });
    });
  });
};

const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.changePassPage = changePassPage;
module.exports.changePass = changePass;
module.exports.signup = signup;
module.exports.getToken = getToken;
