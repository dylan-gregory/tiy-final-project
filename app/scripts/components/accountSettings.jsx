var React = require('react');
var Backbone = require('backbone');
var $ = window.$ = window.jQuery = require('jquery');

var BaseLayout = require('./layouts/base.jsx').BaseLayout;

var User = require('../models/user.js').User;
var ParseFile = require('../models/parseFile.js').ParseFile;
var Client = require('../models/models.js').Client;
var ClientCollection = require('../models/models.js').ClientCollection;
var Coach = require('../models/models.js').Coach;
var CoachCollection = require('../models/models.js').CoachCollection;

require('materialize-sass-origin/js/waves.js');
require('materialize-sass-origin/js/velocity.min.js');
require('materialize-sass-origin/js/cards.js');
require('dropzone');

class AccountSettingsContainer extends React.Component {
  constructor(props){
    super(props);

    var clientCollection = new ClientCollection();
    var currentClient = new Client();
    var coachCollection = new CoachCollection();
    var currentCoach = new Coach();


    var userId = User.current().get('objectId');

    if (User.current().get('isCoach')) {
      coachCollection.fetch().then(() => {
        currentCoach = coachCollection.findWhere({objectId: this.props.id});

        clientCollection = coachCollection.where({coachId: this.props.id});

        this.setState({
          currentCoach: currentCoach
        });

      });
    }else {
      clientCollection.fetch().then(() => {
        currentClient = clientCollection.findWhere({objectId: this.props.id});

        this.setState({
          currentClient: currentClient
        });

      });
    }

    this.state = {
      currentClient,
      currentCoach
    };

  }
  submitEdit(){

  }
  render(){

    return (

      <BaseLayout>
        <div className="container">
          <div className="col m12">
            <div className="row">
              <h3>Account Info: {User.current().get('username')}</h3>
                <div className="card large">
                  <div className="card-image waves-effect waves-block waves-light">
                    <img className="activator" src="images/stock-card-pic.jpg" />
                  </div>
                  <div className="card-content">
                    <span className="card-title activator grey-text text-darken-4">{User.current().get('username')}<i className="material-icons right">more_vert</i></span>
                    <p><a href="#">This is a link</a></p>
                  </div>
                  <div className="card-reveal">
                    <span className="card-title grey-text text-darken-4">Edit Info<i className="material-icons right">close</i></span>
                    <p>Here is some more information about this product that is only revealed once clicked on.</p>

                    <UploadForm submitEdit={this.submitEdit}/>

                  </div>
                </div>
            </div>
          </div>
        </div>

      </BaseLayout>
    )
  }
}

// outside of React and using AJAX requests, encType is NECESSARY - though React takes care of it for us


class UploadForm extends React.Component{
  constructor(props){
    super(props);

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handlePicChange = this.handlePicChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      name: '',
      pic: null,
      preview: null
    };

  }
  handleNameChange(e){
    this.setState({name: e.target.value});

  }
  handlePicChange(e){
    var file = e.target.files[0];
    this.setState({pic: file});

    //use FileReader to display preview
    var reader = new FileReader();
    reader.onloadend = () => {
      this.setState({preview: reader.result});
    }

    reader.readAsDataURL(file);

  }
  handleSubmit(e){
    e.preventDefault();
    // I will actually send state to the parent component, but this is what it might look like there
    // this.props.submitEdit(this.state);
    var pic = this.state.pic;
    var fileUpload = new ParseFile(pic);

    fileUpload.save({}, {
      data: pic
    }).then((response) => {

      var imageUrl = response.url;

      // add a pic column to User endpoint on ParseModel
      // example for Dan's puppy thing, but this gives me an idea of should will work
      // var puppy = new Puppy();
      //
      // var puppy = new Puppy();     won't need to do this, because they're already a User
      //
      //                              maybe like User.current().set() - etc, etc
      //
      // puppy.set({
      //   name: this.state.name,   this could be the persons actual name
      //   pic: {
      //     name: this.state.pic.name,
      //     url: imageUrl
      //   }
      // });
      //
      // puppy.save().then(()=> {
      //
      // })
      //
      // either switch pages/re-render the page to avoid upload request lag - or Dropzone might help that
      //
      // we can then use that url property as the src for an image tag

    });

  }
  render(){
    return (
      <div>
        <div className="row">
          <div className="col m3">
            <form action="/file-upload" onChange={this.handlePicChange} className="dropzone">
              <img src={this.state.preview} />
            </form>
          </div>
          <div className="col m9">
            <form onSubmit={this.handleSubmit} encType="multipart/form-data">
              <input onChange={this.handleNameChange} type="text" placeholder="Your Name" />
                <input type="text" placeholder="Phone #" />
                <input type="text" placeholder="Email address" />

              <input className="btn" type="submit" value="Save"/>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

module.exports = {
  AccountSettingsContainer
};
