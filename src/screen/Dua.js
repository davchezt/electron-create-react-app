import React from 'react';
import { Link } from 'react-router-dom';

let Data = [{}];

class Dua extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: 'orange',
      data: []
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    fetch('http://localhost:8080/products', { method: 'GET' })
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({ data: responseJson }, () => {
        console.log(this.state.data.products)
      });
    })
    .catch((error) => {
      console.log(error);
    });
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('Your favorite flavor is: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return(
      <div>
        <h2>Dua</h2>
        <Link to="/">Home</Link>
        <hr />
        Total Product: {this.state.data.count} pcs
        <ul style={{listStyle: 'none'}}>
        { this.state.data.products !== undefined &&
          this.state.data.products.map(item => (
            <li key={item._id} style={{display: 'block', margin: '10px auto', border: 1, borderStyle: 'solid', width: 250}}>
              #{item._id}<br />
              <img src={`http://localhost:8080/${item.productImage}`} alt={item._id} style={{width: 64}} /><br />
              {item.name} &mdash; Rp.{item.price}
            </li>
          ))
        }
        </ul>
        <hr />
        <form onSubmit={this.handleSubmit}>
          <input type="text" placeholder="anu" value={this.state.value} onChange={this.handleChange} />
          <button>Save</button>
        </form>
      </div>
    );
  }
}

export default Dua;