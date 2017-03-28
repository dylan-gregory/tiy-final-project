var React = require('react');
var Backbone = require('backbone');

var User = require('../../models/user.js').User;
var DetailCollection = require('../../models/models.js').DetailCollection;

require('materialize-sass-origin/js/tooltip.js');
require('materialize-sass-origin/js/bin/materialize.js');

class BaseLayout extends React.Component {
  constructor(props){
    super(props);
    var detailCollection = new DetailCollection();
    var currentDetail;
    var pic;

    if (User.current()) {


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
  }

    this.state = {
      detailCollection,
      user,
      userId,
      pic
    }



  }
  componentDidMount(){
    // $('.tooltipped').tooltip({delay: 2000});
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

             <a href="" className="brand-logo center">Moxy</a>
             <a href="#" data-activates="mobile-demo" className="button-collapse"><i className="material-icons">menu</i></a>

             <ul className="left">
               { User.current() ? <li><span className="chip valign-wrapper user-logged-in">
                 <img className="circle logged-in-avatar"
                   src={this.state.pic !== undefined ? this.state.pic.url : "images/ic_account_circle_black_24px.svg"} />

                 {this.state.currentDetail !== undefined ? this.state.currentDetail.get('name') : null}
               </span></li> : null }
             </ul>

             <ul id="nav-mobile" className="right hide-on-med-and-down">


               { User.current() ? (User.current().get('isCoach') ? <li><a href={'#workspace/' + User.current().get('objectId')}>
               <i className="material-icons tooltipped" data-position="bottom" data-tooltip="Home">home</i></a></li> :
                 <li><a href={'#accountHome/' + User.current().get('objectId')}>
                 <i className="material-icons">home</i></a></li>
               )
                 : null }


               { !User.current() ? <li><a href="#login/" className="waves-effect waves-light btn">Log in</a></li> : null }

               { User.current() ? (User.current().get('isCoach') ? <li><a href={'#workspace/' + User.current().get('objectId') + '/settings' }>
               <i className="material-icons tooltipped" data-position="bottom" data-tooltip="Settings">settings</i></a></li> :
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
