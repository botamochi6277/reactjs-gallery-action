import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import Button from 'react-bootstrap/Button';
import { Button, Card, Row, Col, Badge, ToggleButton, ButtonGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


function MyCard(props) {
    return (
        <Card style={{ width: props.width }}>
            <Card.Img variant="top" src={props.src} />
            <Card.Title>{props.title}</Card.Title>
            <Card.Body>{props.category}</Card.Body>
        </Card>
    )
}

function MyButton(props) {
    return (
        <Button className="mybutton" onClick={props.onClick}>
            {props.value}
        </Button>
    )
}

class Gallery extends React.Component {
    constructor(props) {
        super(props);
        let images = [
            { title: "example01", src: "http://placeholder.pics/svg/300x200", category: "A" },
            { title: "example02", src: "http://placeholder.pics/svg/300x200", category: "A" },
            { title: "example03", src: "http://placeholder.pics/svg/300x200", category: "B" },
        ]

        let buttons = [
            { name: "All", value: "All" }, { name: "A", value: "A" }, { name: "B", value: "B" }
        ]

        this.state = {
            width: "18rem",
            images: images,
            visible_images: images.slice(),
            buttons: buttons,
            category: "All"
        }
    }

    changeCategory(cat) {
        // const new_cat = this.state.category;
        // new_cat = cat;
        this.setState({ category: cat })
    }

    filterImages(cat) {
        this.setState({ category: cat })
        if (cat === "All") {
            this.setState({ visible_images: this.state.images.slice() })
        } else {
            this.setState({
                visible_images: this.state.images.filter(
                    (image) => image.category === cat)
            })
        }
        console.log(this.state.visible_images);
    }


    render() {
        const width = this.state.width;
        const visible_images = this.state.visible_images.slice();
        const cards = visible_images.map((image, index) =>
            <Col>
                <MyCard width={width} title={image.title} src={image.src} category={image.category} key={index} />
            </Col>
        );

        const buttons = this.state.buttons.slice()
        const radio_buttons = buttons.map((radio, idx) =>
            <ToggleButton
                key={idx}
                id={`radio-${idx}`}
                type="radio"
                variant="outline-secondary"
                name="radio"
                value={radio.value}
                checked={this.state.category === radio.value}
                onChange={(e) => this.filterImages(e.currentTarget.value)}>
                {radio.name}
            </ToggleButton>

        );

        return (
            <div className="gallery">
                <div className="game-info">
                    <Badge bg="secondary">{this.state.category}</Badge>
                    <ButtonGroup className="mb-2">
                        {radio_buttons}
                    </ButtonGroup>
                    <div>{/* status */}</div>
                    <Row xs={1} md={3} className="g-4">
                        {cards}
                    </Row>
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

