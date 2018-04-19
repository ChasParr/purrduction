const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  console.dir(controllers.Account);
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
    // change pass
  app.get('/changePass', mid.requiresLogin, controllers.Account.changePassPage);
  app.post('/changePass', mid.requiresLogin, controllers.Account.changePass);
    // petting page
  app.get('/petCatPage', mid.requiresLogin, controllers.Cat.petCatPage);
  app.get('/getRandomCat', mid.requiresLogin, controllers.Cat.getRandomCat);
  app.post('/petCat', mid.requiresLogin, controllers.Cat.petCat);
    // user's cats page
  app.get('/myCatsPage', mid.requiresLogin, controllers.Cat.myCatsPage);
  app.get('/getMyCats', mid.requiresLogin, controllers.Cat.getMyCats);
  app.post('/adoptCat', mid.requiresLogin, controllers.Cat.adoptCat);
  // app.get('/catStats', mid.requiresLogin, controllers.Cat.getCats);
  // app.post('/changeCatName', mid.requiresLogin, controllers.Cat.changeCatName);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
