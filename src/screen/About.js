import React from 'react';
import { Link } from 'react-router-dom';

class About extends React.Component {
  constructor(props) {
    super(props);

    this.state ={

    }
  }

  render() {
    return(
      <div>
        <h2>About</h2>
        <Link to="/">Home</Link>
      </div>
    );
  }
}

export default About;