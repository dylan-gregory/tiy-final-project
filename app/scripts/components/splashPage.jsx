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

          <div className="col m12 l8 valign">
            <div className="card">

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

            <div className="col l4 m6 s12 valign-wrapper">

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

            <div className="col l8 m6 s12">
              <div className="card">
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

            <div className="col l4 m6 s12 valign-wrapper">
              <img className="strawbs" src="images/strawbs.jpeg" />
            </div>

          </div>


        <footer className="page-footer">
          <div className="container">
            <div className="row">
              <div className="col l6 s12">
                <h5 className="white-text">Contact Us</h5>
                <p className="grey-text text-lighten-4">You can use rows and columns here to organize your footer content.</p>
              </div>
              <div className="col l4 offset-l2 s12">
                <h5 className="white-text">Links</h5>
                <ul>
                  <li><a className="grey-text text-lighten-3" href="#!"><i className="fa fa-facebook-square" aria-hidden="true"></i></a></li>
                  <li><a className="grey-text text-lighten-3" href="#!"><i className="fa fa-twitter-square" aria-hidden="true"></i></a></li>
                  <li><a className="grey-text text-lighten-3" href="#!"><i className="fa fa-instagram" aria-hidden="true"></i></a></li>
                  <li><a className="grey-text text-lighten-3" href="#!"><i className="fa fa-google-plus-square" aria-hidden="true"></i></a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="footer-copyright">
            <div className="container">
            © 2017 Copyright Me
            <a className="grey-text text-lighten-4 right" href="https://www.nutritionix.com/business/api">Powered by Nutritionix API</a>
            </div>
          </div>
        </footer>
      </BaseLayout>
    )
  }
}


// <div className="carousel carousel-slider center" data-indicators="true">
//   <div className="carousel-fixed-item center">
//     <a className="btn waves-effect white grey-text darken-text-2">button</a>
//   </div>
//   <div className="carousel-item red white-text" href="#one!">
//     <img src="images/fruit.jpg" />
//     <h2>First Panel</h2>
//     <p className="white-text">This is your first panel</p>
//   </div>
//   <div className="carousel-item amber white-text" href="#two!">
//     <img src="images/strawbs.jpeg" />
//     <h2>Second Panel</h2>
//     <p className="white-text">This is your second panel</p>
//   </div>
//   <div className="carousel-item green white-text" href="#three!">
//     <img src="images/oranges.jpg" />
//     <h2>Third Panel</h2>
//     <p className="white-text">This is your third panel</p>
//   </div>
//   <div className="carousel-item blue white-text" href="#four!">
//     <h2>Fourth Panel</h2>
//     <p className="white-text">This is your fourth panel</p>
//   </div>
// </div>


module.exports = {
  SplashPageContainer
};
