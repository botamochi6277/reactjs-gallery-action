import React from 'react';
import ReactDOM from 'react-dom';
import axios from "axios";
import './index.css';
// import Button from 'react-bootstrap/Button';
import { Button, Card, Row, Col, Badge, ToggleButton, ButtonGroup, Container, Nav, Navbar } from 'react-bootstrap';
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


function MyNavbar(props) {
    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand href="#">{props.brand}</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                    <Nav className="me-auto">
                        <Nav.Link href={`${props.server}/${props.author}`} target="blank_">{props.author}</Nav.Link>
                        <Nav.Link href={`${props.server}/${props.repo}`} target="blank_">Code</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

class Gallery extends React.Component {
    constructor(props) {
        super(props);
        let images = [
            { name: "example00", src: "./imgs/00.png", category: "A" },
            { name: "example01", src: "./imgs/01.png", category: "A" },
            { name: "example02", src: "./imgs/02.png", category: "B" },
        ]
        let categories = images.map((image) => image.category);
        let uniq_categories = uniq(categories);
        uniq_categories = ["All"].concat(uniq_categories.sort());
        let buttons = uniq_categories.map((cat) => { return { name: cat, value: cat }; });

        // get github action variables
        // https://docs.github.com/ja/actions/learn-github-actions/environment-variables
        // react.js need REACT_APP prefix for environment variable names
        const actor = process.env.REACT_APP_GITHUB_ACTOR; // e.g. octocat
        const server = process.env.REACT_APP_GITHUB_SERVER_URL; // e.g. https://github.com
        const repo = process.env.REACT_APP_GITHUB_REPOSITORY; // e.g. octocat/Hello-World
        const brand = repo.split("/")[1];
        console.debug(`actor: ${actor}`)
        console.debug(`server: ${server}`)
        console.debug(`repo: ${repo}`)

        this.state = {
            title: props.title,
            width: "",
            images: images,
            visible_images: images.slice(),
            buttons: buttons,
            actor: actor,
            server: server,
            repo: repo,
            brand: brand,
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
        console.debug(this.state.visible_images);
    }

    componentDidMount() {
        axios.get("./image_list.json").then((response) => {
            const images = response.data.images;
            console.debug(`#images: ${images.length}`);
            const categories = ["All"].concat(images.map((image) => image.category));
            const uniq_categories = uniq(categories);
            const buttons = uniq_categories.map((cat) => { return { name: cat, value: cat }; });
            buttons.map((btn) => console.debug(btn));
            // console.debug(`buttons: ${buttons.map((btn)=>console.debug(btn))}`);
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
                <MyCard width={width} title={image.name} src={image.src} category={image.category} key={index} />
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
                <MyNavbar brand={this.state.brand} author={this.state.actor} server={this.state.server} repo={this.state.repo} />
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
    <Gallery />,
    document.getElementById('root')
);

