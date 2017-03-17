var React = require('react');
var Backbone = require('backbone');

var User = require('../../models/user.js').User;

class BaseLayout extends React.Component {
  constructor(props){
    super(props);

  }
  signOut(){
    localStorage.clear();
    Backbone.history.navigate('login/', {trigger: true});
  }
  render(){
    return(
      <div>
        <div className="navbar-fixed">
          <nav>
           <div className="nav-wrapper">

             <a href="" className="brand-logo">MOMENTUM</a>
             <a href="#" data-activates="mobile-demo" className="button-collapse"><i className="material-icons">menu</i></a>
             <ul id="nav-mobile" className="right hide-on-med-and-down">

               { User.current() ? (User.current().get('isCoach') ? <li><a href={'#workspace/' + User.current().get('objectId')}>
               <i className="material-icons">home</i></a></li> :
                 <li><a href={'#accountHome/' + User.current().get('objectId')}>
                 <i className="material-icons">home</i></a></li>
               )
                 : null }


               { !User.current() ? <li><a href="#login/" className="waves-effect waves-light btn">Log in</a></li> : null }

               { User.current() ? (User.current().get('isCoach') ? <li><a href={'#workspace/' + User.current().get('objectId') + '/settings' }>
               <i className="material-icons">settings</i></a></li> :
                 <li><a href={'#accountHome/' + User.current().get('objectId') + '/settings' }>
                 <i className="material-icons">settings</i></a></li>
               )
                 : null }

               { User.current() ? <li><a onClick={this.signOut} className="waves-effect waves-light btn">Log out</a></li> : null }

             </ul>
           </div>
         </nav>
        </div>

        {this.props.children}

      </div>
    )
  }
}

// <img className="myLogo" src="images/Logo-Red-font.svg"></img>
// <li><a href="#coachPortal/">Coach Portal</a></li>
// <li><a href={User.current() ? "#accountHome/" + User.current().get('objectId') : "#"}>Client page demo</a></li>
// <li><a href={User.current() ? "#workspace/" + User.current().get('objectId') : "#"}>Coach page demo</a></li>


module.exports = {
  BaseLayout
};
