const { Index, About, Create, AddCube, UpdatedDetails, CreateAccessory, AttachAccessory, DisplayError, AddAccessory, Details, GetAccessoryPage, LoginPage, RegisterPage, EditCubePage, DeleteCubePage, RegisterPagePOST, LoginPagePOST, Home, validateToken } = require('../controllers/controllers');

module.exports = (app) => {

    app.get('/', Index);

    app.get('/home', validateToken, Home);

    app.get('/about', About);

    app.get('/create', validateToken, Create);

    app.post('/create', validateToken, AddCube);

    app.get('/details/:id', Details);

    app.get('/login', LoginPage);

    app.post('/login', LoginPagePOST);

    app.get('/register', RegisterPage);
    
    app.post('/register', RegisterPagePOST);

    app.get('/editCube', validateToken, EditCubePage);

    app.get('/deleteCube', validateToken, DeleteCubePage);

    app.get('/updated/details/:id', validateToken, UpdatedDetails);

    app.get('/create/accessory', validateToken, CreateAccessory);

    app.post('/create/accessory', validateToken, AddAccessory);

    app.get('/attachAccessory/:id', validateToken, GetAccessoryPage);

    app.post('/attachAccessory/:id', validateToken, AttachAccessory);

    app.get('/*', DisplayError);
    
};