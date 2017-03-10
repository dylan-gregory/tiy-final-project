var React = require('react');


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
               <li><a href="#coachPortal/">Coach Portal</a></li>

               <li><a href="#">Client Portal</a></li>
               <li><a href="#">JavaScript</a></li>
             </ul>
           </div>
         </nav>
        </div>

        {this.props.children}

      </div>
    )
  }
}

// export default BaseLayout;

module.exports = {
  BaseLayout
};
