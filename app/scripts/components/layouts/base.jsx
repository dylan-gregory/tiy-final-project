var React = require('react');


class BaseLayout extends React.Component {
  constructor(props){
    super(props);

  }
  render(){
    return(
      <div className="navbar-fixed">
        <nav>
         <div className="nav-wrapper">
           <a href="#" className="brand-logo center">MOMENTUM</a>
           <a href="#" data-activates="mobile-demo" className="button-collapse"><i className="material-icons">menu</i></a>
           <ul id="nav-mobile" className="right hide-on-med-and-down">
             <li><a href="#">New Coach Signup</a></li>
             <li><a href="#">Components</a></li>
             <li><a href="#">JavaScript</a></li>
           </ul>
         </div>
       </nav>
      </div>

    )
  }
}

// export default BaseLayout;

module.exports = {
  BaseLayout
};
