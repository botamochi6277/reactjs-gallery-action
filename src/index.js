import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import Button from 'react-bootstrap/Button';
import { Button, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


function MyCard(props) {
    return (
        <Card style={{ width: props.width }}>
            <Card.Img variant="top" src={props.src} />
            <Card.Title>{props.title}</Card.Title>
        </Card>
    )
}
class Gallery extends React.Component {
    constructor(props) {
        super(props);
        let images = [
            { title: "example01", src: "http://placeholder.pics/svg/300" },
            { title: "example02", src: "http://placeholder.pics/svg/300" },
        ]
        this.state = {
            width: "18rem",
            images: images
        }
    }
    render() {
        const width = this.state.width;
        const images = this.state.images;
        const cards = images.map((image, index) =>
            <li>
                <MyCard width={width} title={image.title} src={image.src} key={index} />
            </li>
        );

        return (
            <div className="gallery">
                <div className="game-info">
                    <div>{/* status */}</div>
                    <ul>
                        {cards}
                    </ul>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Gallery />,
    document.getElementById('root')
);

