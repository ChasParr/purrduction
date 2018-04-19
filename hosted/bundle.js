"use strict";

var catRenderer = void 0;
var petCatForm = void 0;
var adoptCatRenderer = void 0;
var PetCatClass = void 0;
var CatListClass = void 0;
var AdoptCatClass = void 0;

var handlePet = function handlePet(e) {
    e.preventDefault();

    $("#domoMessage").animate({ width: 'hide' }, 350);

    console.log($("#petCatForm").serialize());
    sendAjax('POST', $("#petCatForm").attr("action"), $("#petCatForm").serialize(), function () {
        petCatForm.loadRandomCat();
    });
    return false;
};

var renderPetCat = function renderPetCat() {
    //if (this.state.cat)
    return React.createElement(
        "form",
        { id: "petCatForm",
            onSubmit: this.handleSubmit,
            name: "petCatForm",
            action: "/petCat",
            method: "POST",
            className: "petCatForm"
        },
        React.createElement(
            "h3",
            { className: "catNameVisible" },
            this.state.cat.name
        ),
        React.createElement("input", { type: "hidden", name: "catId", value: this.state.cat._id }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: this.props.csrf }),
        React.createElement("input", { className: "petCat", type: "submit", value: "Pet Cat" })
    );
};

var renderCatList = function renderCatList() {
    if (this.state.data.length === 0) {
        return React.createElement(
            "div",
            { className: "catList" },
            React.createElement(
                "h3",
                { className: "noCats" },
                "No Cats yet"
            )
        );
    }

    var catNodes = this.state.data.map(function (cat) {
        return React.createElement(
            "div",
            { key: cat._id, className: "cat" },
            React.createElement("img", { src: "/assets/img/domoface.jpeg", alt: "domo face", className: "domoFace" }),
            React.createElement(
                "h3",
                { className: "catName" },
                cat.name
            ),
            React.createElement(
                "h3",
                null,
                "was last petted by"
            ),
            React.createElement(
                "h3",
                { className: "lastPlayer" },
                cat.lastPlayer
            )
        );
    });

    return React.createElement(
        "div",
        { className: "catList" },
        catNodes
    );
};

var handleAdopt = function handleAdopt(e) {

    e.preventDefault();

    $("#domoMessage").animate({ width: 'hide' }, 350);

    console.log($("#adoptForm").serialize());
    sendAjax('POST', $("#adoptForm").attr("action"), $("#adoptForm").serialize(), function () {
        catList.loadCatsFromServer();
    });
    return false;
};

var renderAdoptCat = function renderAdoptCat() {

    return React.createElement(
        "form",
        { id: "adoptForm",
            onSubmit: this.handleSubmit,
            name: "adoptCatForm",
            action: "/adoptCat",
            method: "POST",
            className: "adoptCatForm"
        },
        React.createElement("input", { type: "hidden", name: "_csrf", value: this.props.csrf }),
        React.createElement("input", { className: "adoptCat", type: "submit", value: "Adopt Cat" })
    );
};

var setup = function setup(csrf) {

    // pet cat button
    PetCatClass = React.createClass({
        displayName: "PetCatClass",

        loadRandomCat: function loadRandomCat() {
            sendAjax('GET', '/getRandomCat', null, function (data) {
                this.setState({ cat: data.cat });
            }.bind(this));
        },
        getInitialState: function getInitialState() {
            return {
                cat: {
                    name: 'none',
                    id: 0
                }
            };
        },
        componentDidMount: function componentDidMount() {
            this.loadRandomCat();
        },
        handleSubmit: handlePet,
        render: renderPetCat
    });

    var petCat = document.querySelector("#petCat");
    if (petCat) {
        petCatForm = ReactDOM.render(React.createElement(PetCatClass, { csrf: csrf }), petCat);
    }

    // my cat list
    CatListClass = React.createClass({
        displayName: "CatListClass",

        loadCatsFromServer: function loadCatsFromServer() {
            sendAjax('GET', '/getMyCats', null, function (data) {
                this.setState({ data: data.cats });
            }.bind(this));
        },
        getInitialState: function getInitialState() {
            return { data: [] };
        },
        componentDidMount: function componentDidMount() {
            this.loadCatsFromServer();
        },
        render: renderCatList
    });

    var cats = document.querySelector("#cats");
    if (cats) {
        catRenderer = ReactDOM.render(React.createElement(CatListClass, null), cats);
    }

    // adopt cat button
    AdoptCatClass = React.createClass({
        displayName: "AdoptCatClass",

        render: renderAdoptCat
    });

    var adoptCat = document.querySelector("#adoptCat");
    if (adoptCat) {
        adoptCatRenderer = ReactDOM.render(React.createElement(AdoptCatClass, { csrf: csrf }), adoptCat);
    }
};

var getToken = function getToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
});
"use strict";

var passForm = void 0;
var PassFormClass = void 0;

var handlePass = function handlePass(e) {
    e.preventDefault();

    $("#domoMessage").animate({ width: 'hide' }, 350);

    if ($("#old").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
        handleError("All fields are required");
        return false;
    }

    if ($("#pass").val() !== $("#pass2").val()) {
        handleError("Passwords do not match");
        return false;
    }

    console.dir(redirect);
    sendAjax('POST', $("#passForm").attr("action"), $("#passForm").serialize(), redirect);

    return false;
};

var renderPass = function renderPass() {
    return React.createElement(
        "form",
        { id: "passForm", name: "passForm",
            onSubmit: this.handleSubmit,
            action: "/changePass",
            method: "POST",
            className: "mainForm"
        },
        React.createElement(
            "label",
            { htmlFor: "oldPass" },
            "Old Password: "
        ),
        React.createElement("input", { id: "oldPass", type: "password", name: "oldPass", placeholder: "password" }),
        React.createElement(
            "label",
            { htmlFor: "pass" },
            "Password: "
        ),
        React.createElement("input", { id: "pass", type: "password", name: "pass", placeholder: "password" }),
        React.createElement(
            "label",
            { htmlFor: "pass2" },
            "Password: "
        ),
        React.createElement("input", { id: "pass2", type: "password", name: "pass2", placeholder: "retype password" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: this.props.csrf }),
        React.createElement("input", { className: "formSubmit", type: "submit", value: "Change" })
    );
};

var createPassForm = function createPassForm(csrf) {
    var PassForm = React.createClass({
        displayName: "PassForm",

        handleSubmit: handlePass,
        render: renderPass
    });

    var changePass = document.querySelector("#changePass");

    if (changePass) {
        passForm = ReactDOM.render(React.createElement(PassForm, { csrf: csrf }), changePass);
    }
};

var setupPass = function setupPass(csrf) {

    createPassForm(csrf);
};

var getTokenPass = function getTokenPass() {
    sendAjax('GET', '/getToken', null, function (result) {
        setupPass(result.csrfToken);
    });
};

$(document).ready(function () {
    getTokenPass();
});
"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#domoMessage").animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(response) {
  console.dir(response);
  $("#domoMessage").animate({ width: 'hide' }, 350);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);

      handleError(messageObj.error);
    }
  });
};
