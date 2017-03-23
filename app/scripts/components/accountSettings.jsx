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

require('materialize-sass-origin/js/bin/materialize.js');
require('materialize-sass-origin/js/waves.js');
// require('materialize-sass-origin/js/velocity.min.js');
require('materialize-sass-origin/js/cards.js');
require('materialize-sass-origin/js/tooltip.js');


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

      if (currentDetail !== undefined) {
        var pic = currentDetail.get('pic');
        this.setState({pic: pic});
      }

      this.setState({
        currentDetail: currentDetail,
        detailCollection,
         pic
      });

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
    this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);

  }
  submitNewDetail(newDetail){

    // this.state.user.set({
    //   name: newDetail.name,
    //       email: newDetail.email,
    //       phone: newDetail.phone,
    //       pic: newDetail.pic
    // });
    //
    // this.state.user.save();

    if (this.state.currentDetail !== undefined) {
      var detail = this.state.currentDetail;

      detail.set({
        name: newDetail.name,
        email: newDetail.email,
        phone: newDetail.phone,
        pic: newDetail.pic
      });

      detail.save().then(() => {

        this.state.detailCollection.fetch().then(() => {
          var currentDetail = this.state.detailCollection.findWhere({ownerId: this.state.userId});

          var pic = currentDetail.get('pic');

          this.setState({
            currentDetail: currentDetail,
            detailCollection: this.state.detailCollection,
            pic
          });

        });

      });

    }else{
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
    }


  }
  componentWillReceiveProps(newProps){
    this.setState({currentDetail: newProps.currentDetail});


  }
  componentDidMount(){
    $('.tooltipped').tooltip({delay: 50});
  }
  render(){

    return (

      <BaseLayout>
        <div className="container">
          <div className="col m12">
            <div className="row">

                <ul className="collection">
                  <li className="collection-item avatar">
                  <img className="circle green" src={this.state.pic.url} />
                  <h4>{this.state.currentDetail !== undefined ? this.state.currentDetail.get('name') : this.state.user.get('username')}</h4>
                  <span>{this.state.user.get('isCoach') == true ? "Your coach ID: " + this.state.user.get('objectId') : null }</span>
                  </li>
                </ul>

                <div className="card large">

                  <div className="card-image waves-effect waves-block waves-light">
                    <img className="activator" src="images/stock-card-pic.jpg" />
                  </div>

                  <div className="card-content">

                    <span className="card-title activator grey-text text-darken-4">
                      {this.state.currentDetail !== undefined ? "email: " + this.state.currentDetail.get('email') : "Why don't you tell us a little about yourself?"}
                      <i data-position="bottom" data-delay="50" data-tooltip="Edit your profile" className="material-icons right tooltipped">rate_review</i>
                    </span>

                    <div>
                        {this.state.currentDetail !== undefined ? "phone: " + this.state.currentDetail.get('phone') : null}
                    </div>

                  </div>
                  <div className="card-reveal">
                    <span className="card-title grey-text text-darken-4">Edit Info<i className="material-icons right">close</i></span>

                    <UploadForm submitNewDetail={this.submitNewDetail}
                                user={this.state.user}
                                currentDetail={this.state.currentDetail}
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



class UploadForm extends React.Component{
  constructor(props){
    super(props);

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handlePicChange = this.handlePicChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleNumberChange = this.handleNumberChange.bind(this);
    this.toggleNewImage = this.toggleNewImage.bind(this);

    var userId = this.props.user.get('objectId');

    this.state = {
      name: '',
      email: '',
      phone: '',
      pic: '',
      preview: '',
      owner: {"__type": "Pointer", "className": "_User", "objectId": this.props.user},
      ownerId: userId,
      newImage: false
    };

  }
  toggleNewImage(){
    this.setState({newImage: true});
    console.log('new?', this.state.newImage);
  }
  componentWillReceiveProps(newProps){

    if (newProps.currentDetail !== undefined) {
      this.setState({
        name: newProps.currentDetail.get('name'),
        email: newProps.currentDetail.get('email'),
        phone: newProps.currentDetail.get('phone'),
        pic: newProps.currentDetail.get('pic')
      });
    }


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
      this.setState({preview: reader.result, newImage: true});
    }

    reader.readAsDataURL(file);

  }
  handleSubmit(e){
    e.preventDefault();

    if (this.state.newImage) {
      var pic = this.state.pic;
      var fileUpload = new ParseFile(pic);

      fileUpload.save({}, {
        data: pic
      }).then((response)=>{

        var imageUrl = response.url;

        this.setState({
          name: this.state.name,
          pic: {
            name: this.state.pic.name,
            url: imageUrl
          },
          email: this.state.email,
          phone: this.state.phone,
        });

        this.props.submitNewDetail(this.state);

      });
    }else {
      this.setState({
        name: this.state.name,
        email: this.state.email,
        phone: this.state.phone,
      });

      this.props.submitNewDetail({
        name: this.state.name,
        email: this.state.email,
        phone: this.state.phone,
      });
    }


  }
  render(){

    var currentPic = new ParseFile(this.state.pic)

    return (
      <div>
        <div className="row">
          <div className="col m3">

          </div>
          <div className="col m9">
            <form onSubmit={this.handleSubmit} encType="multipart/form-data">
              <input onChange={this.handleNameChange} value={this.state.name ? this.state.name : ''} type="text" placeholder="Your Name" />
                <input type="text" onChange={this.handleNumberChange} value={this.state.phone ? this.state.phone : '' } placeholder="Phone #" />
                <input type="text" onChange={this.handleEmailChange} value={this.state.email ? this.state.email : ''} placeholder="Email address" />


                    <div className="file-field input-field">
                      <div className="btn" onClick={this.toggleNewImage}>
                        <span>Upload Picture</span>

                        <input type="file" onChange={this.handlePicChange} />

                      </div>
                      <div className="file-path-wrapper">

                        <input className="file-path validate" onChange={this.handlePicChange} value={this.state.pic ? this.state.pic.name : ''} placeholder="So we know what you look like" />
                      </div>

                    </div>

                    <img className="preview-img" src={this.state.preview} />


              <input className="btn" type="submit" value="Save"/>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

// <div className="switch">
//   <label>
//     Not new pic
//     <input type="checkbox" id="mySwitch" onClick={this.toggleNewImage}/>
//     <span className="lever"></span>
//     New pic
//   </label>
// </div>

module.exports = {
  AccountSettingsContainer
};
