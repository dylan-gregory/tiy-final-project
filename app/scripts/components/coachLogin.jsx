var React = require('react');
var Backbone = require('backbone');

var BaseLayout = require('./layouts/base.jsx').BaseLayout;
var User = require('../models/user').User;

class CoachLoginContainer extends React.Component {
  constructor(props){
    super(props);

  }
  login(creds){
    User.login(creds, function(user){
      Backbone.history.navigate('home/', {trigger: true});
    });
  }
  createAccount(creds){
    // User.signup(creds);
    var user = new User(creds);
    user.save().then(function(data){
      localStorage.setItem('user', JSON.stringify(data));
      Backbone.history.navigate('workspace/', {trigger: true});
    });
  }
  render(){
    return (
      <BaseLayout>
        <div className="container">
          <div className="row">
            <div className="col m6">
              <h2>New Coach? Sign up</h2>
              <CoachSignupForm action={this.createAccount} submitBtn="Create Account"/>
            </div>
            <div className="col m6">
              <h2>Login</h2>
              <CoachLoginForm action={this.login} submitBtn="Login"/>
            </div>
          </div>
        </div>
      </BaseLayout>
    )
  }
}




class CoachLoginForm extends React.Component {
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
// Signup Form for a new COACH - has a property of isCoach set to true
// which will be used for verifying that this is a Coach, NOT a client
////////////////////////////////////////////////////////////////////


class CoachSignupForm extends React.Component {
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
      isCoach: true
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
          <label htmlFor="your-coach-id">Your Coach ID</label>
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
  CoachLoginContainer
}
