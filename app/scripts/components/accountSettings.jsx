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
var Detail = require('../models/models.js').Detail;
var DetailCollection = require('../models/models.js').DetailCollection;

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
    var currentDetail = new Detail();
    var detailCollection = new DetailCollection();

    var user = User.current();

    var userId = User.current().get('objectId');



    detailCollection.fetch().then(() => {
      currentDetail = detailCollection.findWhere({ownerId: userId});

      var pic = currentDetail.get('pic');

      this.setState({
        currentDetail: currentDetail,
        detailCollection,
        pic
      });
      console.log(currentDetail);

    });

    // if (User.current().get('isCoach')) {
    //   coachCollection.fetch().then(() => {
    //     currentCoach = coachCollection.findWhere({objectId: this.props.id});
    //
    //     clientCollection = coachCollection.where({coachId: this.props.id});
    //
    //     this.setState({
    //       currentCoach: currentCoach
    //     });
    //
    //   });
    // }else {
    //   clientCollection.fetch().then(() => {
    //     currentClient = clientCollection.findWhere({objectId: this.props.id});
    //
    //     this.setState({
    //       currentClient: currentClient
    //     });
    //
    //   });
    // }

    this.state = {
      user,
      userId,
      detailCollection,
      currentDetail,
      pic: ''
      // currentClient,
      // currentCoach,
      // userId: userId
    };



    this.submitNewDetail = this.submitNewDetail.bind(this);

  }
  submitNewDetail(newDetail){

    this.state.detailCollection.create(newDetail, {success: () => {


      this.state.detailCollection.fetch().then(() => {
        var currentDetail = this.state.detailCollection.findWhere({ownerId: this.state.userId});

        var pic = currentDetail.get('pic');

        this.setState({
          currentDetail: currentDetail,
          detailCollection: this.state.detailCollection,
          pic
        });

      });
    }});

    this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);

  }
  componentWillReceiveProps(newProps){
    this.setState({currentDetail: newProps.currentDetail});


  }
  render(){

    return (

      <BaseLayout>
        <div className="container">
          <div className="col m12">
            <div className="row">
              <h3>
                <ul className="collection">
                  <li className="collection-item avatar">
                  <img className="circle" src={this.state.pic.url} />
                  {this.state.currentDetail.get('name')}
                  </li>
                </ul>
              </h3>
                <div className="card large">
                  <div className="card-image waves-effect waves-block waves-light">
                    <img className="activator" src="images/stock-card-pic.jpg" />
                  </div>
                  <div className="card-content">
                    <span className="card-title activator grey-text text-darken-4">{this.state.currentDetail.get('email')}<i className="material-icons right">more_vert</i></span>
                    <div>{this.state.currentDetail.get('phone')}</div>
                  </div>
                  <div className="card-reveal">
                    <span className="card-title grey-text text-darken-4">Edit Info<i className="material-icons right">close</i></span>
                    <p>Here is some more information about this product that is only revealed once clicked on.</p>

                    <UploadForm submitNewDetail={this.submitNewDetail}
                                user={this.state.user}
                    />

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
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleNumberChange = this.handleNumberChange.bind(this);

    var userId = this.props.user.get('objectId');

    this.state = {
      name: '',
      email: '',
      phone: '',
      pic: null,
      preview: null,
      owner: {"__type": "Pointer", "className": "_User", "objectId": this.props.user},
      ownerId: userId
    };

    console.log('pic', this.state.pic);

  }
  handleNameChange(e){
    this.setState({name: e.target.value});

  }
  handleNumberChange(e){
    this.setState({phone: e.target.value});
  }
  handleEmailChange(e){
    this.setState({email: e.target.value});
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

    console.log('save?', this.state);
    // I will actually send state to the parent component, but this is what it might look like there
    // this.props.submitNewDetail(this.state);
    var pic = this.state.pic;
    var fileUpload = new ParseFile(pic);

    fileUpload.save({}, {
      data: pic
    }).then((response)=>{
      // 2. we need to get the image url from the server response
      var imageUrl = response.url;
      // 3. we need to save our puppy with the image url
      // {
      //   name: 'Watson',
      //   pic: {name: '', url: ''}
      // }


      this.setState({
        name: this.state.name,
        pic: {
          name: this.state.pic.name,
          url: imageUrl
        },
        email: this.state.email,
        phone: this.state.phone,
      });

      // userDetails.save().then(function(){
      //   console.log(puppy);
      //   // Backbone.history.navigate('detail/', {trigger: true});
      // });
      this.props.submitNewDetail(this.state);

    });

  }
  render(){
    return (
      <div>
        <div className="row">
          <div className="col m3">

          </div>
          <div className="col m9">
            <form onSubmit={this.handleSubmit} encType="multipart/form-data">
              <input onChange={this.handleNameChange} type="text" placeholder="Your Name" />
                <input type="text" onChange={this.handleNumberChange} placeholder="Phone #" />
                <input type="text" onChange={this.handleEmailChange} placeholder="Email address" />

                    <div className="file-field input-field">
                      <div className="btn">
                        <span>Upload Avatar</span>
                        <input type="file" onChange={this.handlePicChange}/>
                      </div>
                      <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                      </div>
                    </div>

                    <img src={this.state.preview} />


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
