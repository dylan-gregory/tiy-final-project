var React = require('react');
var Backbone = require('backbone');
var $ = require('jquery');

var BaseLayout = require('./layouts/base.jsx').BaseLayout;
var User = require('../models/user').User;

class UserLoginContainer extends React.Component {
  constructor(props){
    super(props);


  }
  login(creds){
    User.login(creds, function(user){
      if (user.get('isCoach')) {
        Backbone.history.navigate('workspace/' + user.get('objectId'), {trigger: true});
      }else {
        Backbone.history.navigate('accountHome/' + user.get('objectId'), {trigger: true} );
      }


    });
  }
  createAccount(creds){
    // User.signup(creds);
    var user = new User(creds);
    user.save().then(function(data){
      localStorage.setItem('user', JSON.stringify(data));
      Backbone.history.navigate('', {trigger: true});
    });
  }
  render(){
    return (
      <BaseLayout>
        <div className="container">
          <div className="row">
            <div className="col m6">
              <h2>New to Momentum? Sign up</h2>
              <UserSignupForm action={this.createAccount} submitBtn="Create Account"/>
            </div>
            <div className="col m6">
              <h2>Login</h2>
              <UserLoginForm action={this.login} submitBtn="Login"/>
            </div>
          </div>
        </div>
      </BaseLayout>
    )
  }
}




class UserLoginForm extends React.Component {
  constructor(props){
    super(props);

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      username: '',
      password: ''
    };
  }
  handleEmailChange(e){
    this.setState({username: e.target.value});
  }
  handlePasswordChange(e){
    this.setState({password: e.target.value});
  }
  handleSubmit(e){
    e.preventDefault();
    // input data.... this.state
    this.props.action(this.state);
  }
  render(){
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="form-group">
          <label htmlFor="email-login">Email address</label>
          <input onChange={this.handleEmailChange} className="form-control" name="email" id="email-login" type="email" placeholder="email" />
        </div>

        <div className="form-group">
          <label htmlFor="password-login">Password</label>
          <input onChange={this.handlePasswordChange} className="form-control" name="password" id="password-login" type="password" placeholder="Password Please" />
        </div>

        <input className="btn btn-primary" type="submit" value={this.props.submitBtn} />
      </form>
    )
  }
}

/////////////////////////////////////////////////////////////////////
// Signup Form for a new CLIENT - has a property of isCoach set to false
// which will be used for verifying that this is a Client, NOT a Coach
////////////////////////////////////////////////////////////////////


class UserSignupForm extends React.Component {
  constructor(props){
    super(props);

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCoachChange = this.handleCoachChange.bind(this);

    this.state = {
      username: '',
      password: '',
      coachId: '',
      isCoach: false
    };
  }
  handleEmailChange(e){
    this.setState({username: e.target.value});
  }
  handlePasswordChange(e){
    this.setState({password: e.target.value});
  }
  handleCoachChange(e){
    this.setState({coachId: e.target.value});
  }
  handleSubmit(e){
    e.preventDefault();
    // input data.... this.state
    this.props.action(this.state);
  }
  render(){
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="form-group">
          <label htmlFor="your-coach-id">ID# of Your Coach</label>
          <input onChange={this.handleCoachChange} className="form-control" name="coach-id" id="your-coach-id" type="text" placeholder="ID#" />
        </div>

        <div className="form-group">
          <label htmlFor="email-login">Email address</label>
          <input onChange={this.handleEmailChange} className="form-control" name="email" id="email-login" type="email" placeholder="email" />
        </div>

        <div className="form-group">
          <label htmlFor="password-login">Password</label>
          <input onChange={this.handlePasswordChange} className="form-control" name="password" id="password-login" type="password" placeholder="Password Please" />
        </div>

        <input className="btn btn-primary" type="submit" value={this.props.submitBtn} />
      </form>
    )
  }
}

module.exports = {
  UserLoginContainer
}
