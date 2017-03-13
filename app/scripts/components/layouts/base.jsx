var React = require('react');

var User = require('../../models/user.js').User;

class BaseLayout extends React.Component {
  constructor(props){
    super(props);

  }
  render(){
    return(
      <div>
        <div className="navbar-fixed">
          <nav>
           <div className="nav-wrapper">

             <a href="#" className="brand-logo center">MOMENTUM</a>
             <a href="#" data-activates="mobile-demo" className="button-collapse"><i className="material-icons">menu</i></a>
             <ul id="nav-mobile" className="right hide-on-med-and-down">

               <li><a href="#">Client Portal</a></li>
               <li><a href="#coachPortal/">Coach Portal</a></li>
               <li><a href={"#accountHome/" + User.current().get('objectId')}>Client page demo</a></li>
               <li><a href={"#workspace/" + User.current().get('objectId')}>Coach page demo</a></li>
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


module.exports = {
  BaseLayout
};
