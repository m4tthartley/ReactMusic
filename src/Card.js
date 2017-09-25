import React from 'react'
import Radium,{Style} from 'radium'

const green = '#1db954'
const style = {
  margin: '10px 0',
  width: '165px',
  height: '165px',
  position: 'relative',
  backgroundColor: green,
  ':hover': {
    backgroundColor: 'blue',
  },
  image: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: '0'
  },
  name: {
    fontSize: '12px',
    color: 'white',
    margin: '0',
    padding: '5px',
    backgroundColor: 'black',
    display: 'inline-block',
    position: 'relative',
    zIndex: 1
  }
}

class Card extends React.Component {
  render() {return(
    <div style={style}>
      {this.props.image && <img style={style.image} height="50" src={this.props.image} />}
      <p style={style.name}>{this.props.name}</p>
    </div>
  )}
}
Card = Radium(Card)
export default Card