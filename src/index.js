import React from 'react';
import ReactDOM from 'react-dom';
import { Helmet } from 'react-helmet';
import axios from "axios";
import './index.css';
import { Card, Row, Col, Badge, ToggleButton, ButtonGroup, Container, Nav, Navbar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function uniq(array) {
    const unique_array = [];
    for (const elem of array) {
        if (unique_array.indexOf(elem) < 0) unique_array.push(elem);
    }
    return unique_array;
}

function MyCard(props) {
    const badges = props.tags.map((tag, index) =>
        <Badge pill bg="secondary" key={index}> {tag}</Badge>
    );
    return (
        <Card style={{ width: props.width }} >
            <Card.Header>
                {badges}
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

const MyHelmet = (props) => {
    return (
        <Helmet>
            <meta charSet="utf-8" />
            <title>
                {props.title}
            </title>
        </Helmet>
    );
};

class Gallery extends React.Component {
    constructor(props) {
        super(props);
        let images = [
            { name: "example00", src: "./imgs/00.png", tags: ["example", "A"] },
            { name: "example01", src: "./imgs/01.png", tags: ["example", "A"] },
            { name: "example02", src: "./imgs/02.png", tags: ["example", "B"] },
        ]
        let tags = []
        for (const key in images) {
            if (Object.hasOwnProperty.call(images, key)) {
                const image = images[key];
                tags = tags.concat(image.tags);
            }
        }
        let uniq_tags = uniq(tags);
        uniq_tags = ["All"].concat(uniq_tags.sort());
        let buttons = uniq_tags.map((tag) => { return { name: tag, value: tag }; });

        this.state = {
            title: props.title,
            width: "",
            images: images,
            visible_images: images.slice(),
            buttons: buttons,
            actor: "octcat",
            server: "https://github.com",
            repo: "octocat/Hello-World",
            brand: "Hello-World",
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
                    (image) => image.tags.includes(cat))
            })
        }
        console.debug(this.state.visible_images);
    }

    componentDidMount() {
        // load page info
        axios.get("./page_info.json").then((response) => {
            const info = response.data;
            this.setState(
                {
                    actor: info.actor,
                    server: info.server,
                    repo: info.repo,
                    brand: info.repo.split("/").slice(-1)
                }
            );
        });

        // load image list
        axios.get("./image_list.json").then((response) => {
            const images = response.data.images;
            console.debug(`#images: ${images.length}`);

            let tags = []
            for (const key in images) {
                if (Object.hasOwnProperty.call(images, key)) {
                    const image = images[key];
                    tags = tags.concat(image.tags);
                }
            }

            console.debug(`#tags: ${tags.length}`)
            console.debug(`tags: ${tags}`)
            let uniq_tags = uniq(tags);
            uniq_tags = ["All"].concat(uniq_tags.sort());
            console.debug(`uniq_tags: ${uniq_tags}`)
            let buttons = uniq_tags.map((tag) => { return { name: tag, value: tag }; });
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
                <MyCard width={width} title={image.name} src={image.src} tags={image.tags} key={index} />
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
            <div className="app">
                <MyHelmet title={this.state.brand} />
                <Container className="gallery">
                    <MyNavbar brand={this.state.brand} author={this.state.actor} server={this.state.server} repo={this.state.repo} />
                    <div className="image card">
                        <ButtonGroup className="mb-2">
                            {radio_buttons}
                        </ButtonGroup>
                        <Row xs={1} md={3} className="g-4">
                            {cards}
                        </Row>
                    </div>
                </Container>
            </div>
        );
    }
}




// ========================================

ReactDOM.render(
    <Gallery />,
    document.getElementById('root')
);

