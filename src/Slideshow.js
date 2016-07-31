import React, { Component } from 'react';

import "./css/slideshow.scss";

// domains extracts the domain from a URL.
function domain(url) {
  let a = document.createElement('a'); // Yep.
  a.href = url;
  return a.hostname;
}

// horizontalScroll performs an ease in-out smooth scroll within 'duration' milliseconds. 
function horizontalScroll(element, to, duration, callback) {
    var start = element.scrollLeft,
        change = to - start,
        increment = 3;

    var animateScroll = function(elapsedTime) {        
        elapsedTime += increment;
        var position = easeInOut(elapsedTime, start, change, duration);                        
        element.scrollLeft = position; 
        if(elapsedTime < duration) {
            setTimeout(function() {
                animateScroll(elapsedTime);
            }, increment);
        } else {
          element.scrollLeft = to; 
          if(callback) {
            callback();
          }
        }
    };

    animateScroll(0);
}

// Calculates animation position in a given time using quadratic in-out easing.
function easeInOut(currentTime, start, change, duration) {
    currentTime /= duration / 2;
    if (currentTime < 1) {
        return change / 2 * currentTime * currentTime + start;
    }
    currentTime -= 1;
    return -change / 2 * (currentTime * (currentTime - 2) - 1) + start;
}

class Slide extends Component {
  static propTypes = {
    slide: React.PropTypes.object.isRequired
  };
  
  render() {
    let {slide} = this.props;
    
    return (
      <div className="slide" style={{backgroundImage: 'url(\''+slide.imageURL+'\')'}}>
        <div className="container">
          <div className="slide-info">
            <div className="slide-title">
              {slide.title}
            </div>
            <div className="slide-subtitle">
              {slide.subtitle}
            </div>
          </div>
          <a className="slide-link" href="{slide.link}">
            <div>
              {domain(slide.link)}
            </div>
          </a>
        </div>
      </div>
    );
  }
}

// Slideshow is a responsive full-width image gallery slideshow.
export default class Slideshow extends Component {
  static defaultProps = {
    height: 0,
    maxHeight: 800,
    aspectRatio: 16/9,
    scrollDuration: 400,
    roundRobin: false
  };
  
  static propTypes = {
    slides: React.PropTypes.array.isRequired,
    
    // height is the exact height of the slideshow.
    // If height is omitted, it would be determined by the windows' width
    // and aspectRatio. 
    height: React.PropTypes.number,
    maxHeight: React.PropTypes.number, // default is 800 [px].
    aspectRatio: React.PropTypes.number, // 16:9 by default.
    
    // scrollDuration is the scroll animation time in milliseconds.
    // The lower the number, the faster the scroll. 
    scrollDuration: React.PropTypes.number, // 400ms by default.
    
    // If roundRobin is true, clicking right in the last slide scrolls to the first
    // and clicking left in the first slide scrolls to the last.
    roundRobin: React.PropTypes.bool,
    
    // onScroll is called to report index of the current slide.
    onScroll: React.PropTypes.func
  };
  
  state = {
    height: 0,
    index: 0,
    scrolling: false
  };
  
  componentDidMount() {
    this.carousel.scrollLeft = 0; // Reset scroll position (Firefox remembers.)
    this.maintainHeight();
    window.addEventListener("resize", this.onResize);
  }
  
  componentWillReceiveProps(nextProps) {
    let {height, aspectRatio} = this.props;
    if(nextProps.height != height ||
      (height == 0 && nextProps.aspectRatio != aspectRatio)) {
      this.maintainHeight();
    }
  }
  
  componentWillUnmount() {
    window.removeEventListener("resize", this.onResize);
  }
  
  onResize = () => {
    this.maintainHeight();
    this.maintainScrollPosition();
  };
  
  // maintainHeight adjusts slideshow's height according to the
  // given height, maxHeight and aspectRatio properties. Read propTypes.
  maintainHeight = () => {
    let {height, maxHeight, aspectRatio} = this.props;
    if(height == 0) {
      height = window.innerWidth / aspectRatio;
    }
    if(maxHeight > 0 && height > maxHeight) {
      height = maxHeight;
    }
    this.setState({height});
  };
  
  // maintainScrollPosition adjusts scroll position to keep current slide in it's place
  // on window resize.
  maintainScrollPosition = () => {
    this.carousel.scrollLeft = this.carousel.offsetWidth*this.state.index;
  }
  
  // scroll scrolls n slides to the right or n slides to the left if n is negative.
  scroll = (n) => {
    // Figure out index and X position of target slide.
    let {index} = this.state, {slides, scrollDuration} = this.props;
    let i = index+n;
    // Round-robin.
    if(i >= slides.length) {
      i = slides.length-i;
    } else if(i < 0) {
      i = slides.length+i;
    }
    let slidePos = this.carousel.offsetWidth*i;
    
    // 'scrolling' is a lock to make sure only one scroll command happens at a given time.
    // OMG I did concurrency. 
    if(this.state.scrolling) {
      return; // Phew..
    }
    this.setState({scrolling: true, index: i});
    
    // Smooth scroll to target slide.
    horizontalScroll(this.carousel, slidePos, scrollDuration, () => {
      this.setState({scrolling: false});
    });
    
    if(this.props.onScroll) {
      this.props.onScroll(i);
    }
  };
  
  scrollLeft = () => {
    this.scroll(-1);
  };
  
  scrollRight = () => {
    this.scroll(1)
  };
  
  render() {
    let {slides, roundRobin} = this.props, {index} = this.state;
    
    let slideNodes = slides.map((slide, i) => {
      return <Slide key={i} slide={slide} />;
    });
    
    // Hide left or right buttons if there's no left or right slides. 
    let left, right;
    if(roundRobin || index > 0) {
      left = (
        <div className="carousel-left" onClick={this.scrollLeft}>
          <div className="carousel-arrow"></div>
        </div>
      );
    }
    if(roundRobin || index < slides.length-1) {
      right = (
        <div className="carousel-right" onClick={this.scrollRight}>
          <div className="carousel-arrow"></div>
        </div>
      );
    }
    
    return (
      <div
        className="carousel"
        style={{height: this.state.height}}>
        <div className="slides" ref={(ref) => this.carousel = ref}>
          {slideNodes}
        </div>
        
        {left}
        {right}
	    </div>
    );
  }
}
