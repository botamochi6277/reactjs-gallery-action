import React from 'react';
import ReactDOM from 'react-dom';
import axios from "axios";
import './index.css';
// import Button from 'react-bootstrap/Button';
import { Button, Card, Row, Col, Badge, ToggleButton, ButtonGroup, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function uniq(array) {
    const unique_array = [];
    for (const elem of array) {
        if (unique_array.indexOf(elem) < 0) unique_array.push(elem);
    }
    return unique_array;
}

function MyCard(props) {
    return (
        <Card style={{ width: props.width }} >
            <Card.Header>
                <Badge pill bg="secondary">
                    {props.category}
                </Badge>
            </Card.Header>
            <Card.Img variant="top" src={props.src} />
            <Card.Title>{props.title}</Card.Title>
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
            { title: "example00", src: "/imgs/00.png", category: "A" },
            { title: "example01", src: "/imgs/01.png", category: "A" },
            { title: "example02", src: "/imgs/02.png", category: "B" },
        ]
        let categories = ["All"].concat(images.map((image) => image.category));
        let uniq_categories = uniq(categories);
        let buttons = uniq_categories.map((cat) => { return { name: cat, value: cat }; });

        this.state = {
            title: props.title,
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

    componentDidMount() {
        axios.get("/image_list.json").then((response) => {
            const images = response.data.images;
            console.log(`#images: ${images.length}`);
            const categories = ["All"].concat(images.map((image) => image.category));
            const uniq_categories = uniq(categories);
            const buttons = uniq_categories.map((cat) => { return { name: cat, value: cat }; });
            buttons.map((btn) => console.log(btn));
            // console.log(`buttons: ${buttons.map((btn)=>console.log(btn))}`);
            this.setState({
                images: images,
                visible_images: images.slice(),
                buttons: buttons.slice(),
            })
        });
    }


    render() {
        const width = this.state.width;
        const visible_images = this.state.visible_images.slice();
        const cards = visible_images.map((image, index) =>
            <Col key={index}>
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
            <Container className="gallery">
                <h2>{this.state.title}</h2>
                <div className="game-info">
                    <ButtonGroup className="mb-2">
                        {radio_buttons}
                    </ButtonGroup>
                    <Row xs={1} md={3} className="g-4">
                        {cards}
                    </Row>
                </div>
            </Container>
        );
    }
}

// ========================================

ReactDOM.render(
    <Gallery title="My Gallery" />,
    document.getElementById('root')
);

