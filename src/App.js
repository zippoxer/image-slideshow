import React, { Component } from 'react';
import Slideshow from './Slideshow';
import Mod from './Mod';

export default class App extends Component {
  static defaultSlides = [
    {
      title: 'Independence Day: Resurgence',
      subtitle: 'Get tickets before it\'s too late.',
      imageURL: 'http://s3.foxmovies.com/foxmovies/production/films/107/images/feature/home-page-feature-image-front-main-stage-3.jpg',
      link: 'http://www.foxmovies.com/movies/independence-day-resurgence'
    },
    {
      title: 'Assassin\'s Creed',
      subtitle: 'Because the game was successful.',
      imageURL: 'http://s3.foxmovies.com/foxmovies/production/films/111/images/feature/home-page-feature-image-front-main-stage-2.jpg',
      link: 'http://www.foxmovies.com/movies/independence-day-resurgence'
    }
  ];
  
  state = {
    slides: null,
    currentSlide: 0,
    roundRobin: false
  };
  
  componentWillMount() {
    // Load slides from localStorage or use defaultSlides.
    let slides = localStorage.getItem("slides");
    if(slides) {
      try {
        slides = JSON.parse(slides);
      } catch(e) {
        slides = App.defaultSlides.slice(0); // clone array
      }
    }
    if(!slides) {
      slides = App.defaultSlides.slice(0); // clone array
    }
    console.log('slides',slides);
    this.setState({slides});
  }
  
  handleScroll = (index) => {
    this.setState({currentSlide: index});
  };
  
  saveSlides = () => {
    localStorage.setItem("slides", JSON.stringify(this.state.slides));
  };
  
  handleSlideAdd = (slide) => {
    let slides = this.state.slides.slice(0);
    slides.push(slide);
    this.setState({slides}, this.saveSlides);
  };
  
  handleSlideRemove = () => {
    let slides = this.state.slides.slice(0);
		slides.splice(this.state.currentSlide, 1);
		this.setState({slides}, this.saveSlides);
  };
  
  handleRoundRobinChange = (roundRobin) => {
    this.setState({roundRobin})
  };
  
  render() {
    return (
      <div>
        <Slideshow slides={this.state.slides}
          roundRobin={this.state.roundRobin}
          onScroll={this.handleScroll} />
          
        <Mod onSlideAdd={this.handleSlideAdd}
          onSlideRemove={this.handleSlideRemove}
          onRoundRobinChange={this.handleRoundRobinChange} />
          
        <div className="footer">
          Moshe Revah 2016
        </div>
      </div>
    );
  }
}
