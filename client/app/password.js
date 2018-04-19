let passForm;
let PassFormClass;

const handlePass = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({width:'hide'},350);

    if($("#old").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
      handleError("All fields are required");
      return false;
    }

    if($("#pass").val() !== $("#pass2").val()) {
      handleError("Passwords do not match");
      return false;           
    }

    console.dir(redirect);
    sendAjax('POST', $("#passForm").attr("action"), $("#passForm").serialize(), redirect);

    return false;
};


const renderPass = function() {
    return (
    <form id="passForm" name="passForm"
        onSubmit={this.handleSubmit}
        action="/changePass"
        method="POST"
        className="mainForm"
        >
        <label htmlFor="oldPass">Old Password: </label>
        <input id="oldPass" type="password" name="oldPass" placeholder="password" />
        <label htmlFor="pass">Password: </label>
        <input id="pass" type="password" name="pass" placeholder="password" />
        <label htmlFor="pass2">Password: </label>
        <input id="pass2" type="password" name="pass2" placeholder="retype password" />
        <input type="hidden" name="_csrf" value={this.props.csrf} />
        <input className="formSubmit" type="submit" value="Change" />
    </form>
        
    );
};

const createPassForm = function(csrf) {
    const PassForm = React.createClass({
        handleSubmit: handlePass,
        render: renderPass,
    });
    
    const changePass = document.querySelector("#changePass");
    
    if (changePass){
    passForm = ReactDOM.render(
            <PassForm csrf={csrf} />, changePass
        );
    }
    
};

const setupPass = function(csrf) {
    
    createPassForm(csrf);
};

const getTokenPass = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setupPass(result.csrfToken);
    });
};

$(document).ready(function() {
    getTokenPass();
});