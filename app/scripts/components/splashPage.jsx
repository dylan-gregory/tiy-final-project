var React = require('react');
var $ = window.$ = window.jQuery = require('jquery');

require('materialize-sass-origin/js/bin/materialize.js');
require('materialize-sass-origin/js/carousel.js');
require('materialize-sass-origin/js/cards.js');

var BaseLayout = require('./layouts/base.jsx').BaseLayout;

class SplashPageContainer extends React.Component {
  constructor(props){
    super(props);

  }
  componentDidMount(){
    // $('.carousel').carousel();
    // $('.carousel-slider').slider({full_width: true});
    // $('.carousel.carousel-slider').carousel({full_width: true});
  }
  render(){
    return(

      <BaseLayout>
        <div className="header col m12 valign-wrapper">
          <div className="row splash-pic">
          <img src="images/potential_logo_yoga.jpg" />



          </div>
        </div>
        <div className="row splash-row">

          <div className="col m12 l8 ">
            <div className="card top-card">

              <div className="card-content client-coach-script">
                <div>
                  <h3 className="bold-header">
                    Looking for a change of pace?
                  </h3>
                </div>

                <p className="splash-p">Changing the way you live is hard. Climbing those proverbial mountains and breaking down the obstacles in your mind requires a lot of willpower - strength - MOXY. And it's so much easier when you've got someone else on your team to lead the way or just nudge you in the right direction.</p>

              </div>
            </div>

            </div>

            <div className="col l4 s12 valign-wrapper">

              <img className="guide-pic" src="images/guide.jpeg"/>

            </div>

          </div>

          <div className="row card-row">
            <div className="col m4 s12 splash-col">

              <div className="card splash-card">
                <div className="card-image">
                  <img src="images/health_food.jpg" />

                </div>
                <div className="card-content">
                  We help you meet your goals by giving you a straightforward, easy to use interface to keep up with your objectives and eating habits.
                </div>
              </div>

            </div>
            <div className="col m4 s12 splash-col">

              <div className="card splash-card">
                <div className="card-image">
                  <img src="images/oranges.jpg" />

                </div>
                <div className="card-content">
                  We help you make healthy and wise life choices through professional accountabiliy and personalized, attainable steps toward your goals.
                </div>
              </div>

            </div>

            <div className="col m4 s12 splash-col">

              <div className="card splash-card">
                <div className="card-image">
                  <img src="images/coach_to_you.jpeg" />

                </div>
                <div className="card-content">
                  We bring the coach to you.
                  Your life is busy - we know. We make it possible to work with any type of schedule, allowing everyone the opportunity to work towards a healthier life.
                </div>
              </div>

            </div>


          </div>

          <div className="row splash-row">

            <div className="col l8 s12">
              <div className="card bottom-card">
                <div className="card-content client-coach-script">
                  <div>
                    <h3 className="bold-header">
                      Or maybe you're a coach?
                    </h3>
                  </div>
                    <div>
                      <p className="splash-p">
                        It's difficult to balance your kids soccer games, doctors appointments, and client progress all at the same time. We would love to connect you to your clients and help keep your priorties in order.
                      </p>
                    </div>
                </div>

              </div>
            </div>

            <div className="col l4 s12 valign-wrapper">
              <img className="strawbs" src="images/strawbs.jpeg" />
            </div>

          </div>


        <footer className="page-footer">
          <div className="container">
            <div className="row">
              <div className="col l6 s12">
                <h5 className="white-text">Contact Us</h5>

                  <div className="col l3">
                    <a className="grey-text text-lighten-3 social" href="#!"><i className="fa fa-envelope social" aria-hidden="true"></i></a>
                  </div>

                  <div className="col l3">
                    <a className="grey-text text-lighten-3 social" href="#!"><i className="fa fa-facebook-square social" aria-hidden="true"></i></a>
                  </div>

                  <div className="col l3">
                    <a className="grey-text text-lighten-3 social" href="#!"><i className="fa fa-twitter-square social" aria-hidden="true"></i></a>
                  </div>

                  <div className="col l3">
                    <a className="grey-text text-lighten-3 social" href="#!"><i className="fa fa-instagram social" aria-hidden="true"></i></a>
                  </div>

              </div>

            </div>

          </div>
          <div className="footer-copyright">
            <div className="container">
            <span>© 2017 Copyright, built and styled by dylangregory.io</span>

            <a className="grey-text text-lighten-4 right" href="https://www.nutritionix.com/business/api">Powered by Nutritionix API</a>
            </div>

          </div>
        </footer>
      </BaseLayout>
    )
  }
}



module.exports = {
  SplashPageContainer
};
