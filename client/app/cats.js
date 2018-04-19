let catRenderer;
let petCatForm;
let adoptCatRenderer;
let PetCatClass;
let CatListClass;
let AdoptCatClass;

const handlePet = (e) => {
    e.preventDefault();
    
    $("#domoMessage").animate({width:'hide'}, 350);
    
    console.log($("#petCatForm").serialize());
    sendAjax('POST', $("#petCatForm").attr("action"), $("#petCatForm").serialize(), function() {
        petCatForm.loadRandomCat();
    });
    return false;
};

const renderPetCat = function() {
  //if (this.state.cat)
    return (
        <form id="petCatForm"
            onSubmit={this.handleSubmit}
            name="petCatForm"
            action="/petCat"
            method="POST"
            className="petCatForm"
        >
            <h3 className="catNameVisible">{this.state.cat.name}</h3>
            <input type="hidden" name="catId" value={this.state.cat._id} />
            <input type="hidden" name="_csrf" value={this.props.csrf} />
            <input className="petCat" type="submit" value="Pet Cat" />
        </form>
        
    );
};

const renderCatList = function(){
    if (this.state.data.length === 0) {
        return (
            <div className="catList">
                <h3 className="noCats">No Cats yet</h3>
            </div>
        );
    }
    
    const catNodes = this.state.data.map(function(cat) {
        return (
            <div key={cat._id} className="cat">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
            <h3 className="catName">{cat.name}</h3>
            <h3>was last petted by</h3>
            <h3 className="lastPlayer">{cat.lastPlayer}</h3>
            </div>
        );
    });
    
    return (
        <div className="catList">
          {catNodes}
        </div>
    );
};

const handleAdopt = (e) => {
		
    e.preventDefault();
    
    $("#domoMessage").animate({width:'hide'}, 350);
    
    console.log($("#adoptForm").serialize());
    sendAjax('POST', $("#adoptForm").attr("action"), $("#adoptForm").serialize(), function() {
        catList.loadCatsFromServer();
    });
    return false;
};

const renderAdoptCat = function() {
  
		return(
        <form id="adoptForm"
            onSubmit={this.handleSubmit}
            name="adoptCatForm"
            action="/adoptCat"
            method="POST"
            className="adoptCatForm"
        >
            <input type="hidden" name="_csrf" value={this.props.csrf} />
            <input className="adoptCat" type="submit" value="Adopt Cat" />
        </form>
        
		);
};

const setup = function(csrf) {
		
		// pet cat button
    PetCatClass = React.createClass({
        loadRandomCat: function() {
            sendAjax('GET', '/getRandomCat', null, function(data) {
                this.setState({cat: data.cat});
            }.bind(this));
        },
        getInitialState: function() {
            return {
								cat: { 
									name: 'none',
									id: 0,
								},
						};
        },
        componentDidMount: function() {
            this.loadRandomCat();
        },
        handleSubmit: handlePet,
        render: renderPetCat,
    });
		    
    const petCat = document.querySelector("#petCat");
    if (petCat){
        petCatForm = ReactDOM.render(
            <PetCatClass csrf={csrf} />, petCat
        );
    }
		
		// my cat list
    CatListClass = React.createClass({
        loadCatsFromServer: function() {
            sendAjax('GET', '/getMyCats', null, function(data) {
                this.setState({data:data.cats});
            }.bind(this));
        },
        getInitialState: function() {
            return {data: []};
        },
        componentDidMount: function() {
            this.loadCatsFromServer();
        },
        render: renderCatList
        });

    const cats = document.querySelector("#cats");
    if (cats){
        catRenderer = ReactDOM.render(
            <CatListClass />, cats
        );
    }
		
		// adopt cat button
		AdoptCatClass = React.createClass({
				render: renderAdoptCat
		});
		
		const adoptCat = document.querySelector("#adoptCat");
    if (adoptCat){
        adoptCatRenderer = ReactDOM.render(
            <AdoptCatClass csrf={csrf} />, adoptCat
        );
    }
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
}

$(document).ready(function() {
    getToken();
});
