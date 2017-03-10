var React = require('react');
var Backbone = require('backbone');
var $ = window.$ = window.jQuery = require('jquery');
require('materialize-sass-origin/js/collapsible.js');
// require('jquery-ui/ui/effects');




var BaseLayout = require('./layouts/base.jsx').BaseLayout;

class CoachWorkspaceContainer extends React.Component{
  constructor(props){
    super(props);

    // $(document).ready(function(){
    //
    // });


  }
  componentDidMount(){

    $('.collapsible').collapsible();

  }
  render(){
    return (

      <BaseLayout>

          <div className="container">
            <header>Username/Icon</header>
            <div className="row">
              <div className="col m8">
                <h2>Client List</h2>
                <ul className="collapsible" data-collapsible="accordion">
                  <li>
                    <div className="collapsible-header">Sam</div>
                    <div className="collapsible-body">percent bar</div>
                  </li>
                  <li>
                    <div className="collapsible-header">David</div>
                    <div className="collapsible-body">percent bar</div>
                  </li>
                  <li>
                    <div className="collapsible-header">Carl</div>
                    <div className="collapsible-body">percent bar</div>
                  </li>
                </ul>
              </div>
              <div className="col s4">
                <h2>Client Leaderboard</h2>
                  <table className="striped">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Score/Points</th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr>
                        <td>Carl</td>
                        <td>1,567</td>
                      </tr>
                      <tr>
                        <td>David</td>
                        <td>1,421</td>
                      </tr>
                      <tr>
                        <td>Sam</td>
                        <td>1,345</td>
                      </tr>
                    </tbody>
                  </table>
              </div>
            </div>
          </div>
      </BaseLayout>
    )
  }
}

module.exports = {
  CoachWorkspaceContainer
}
