import Container from 'react-bootstrap/Container'
import Carousel from 'react-bootstrap/Carousel';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import { useNavigate } from 'react-router-dom';
function HomePage() {
    const navigate = useNavigate()
    const handleViewProductBtn = () => {
        navigate('/products')
    }
    return (
        <Container fluid>
            <div style={{ width: "80%", margin: "0 auto" }}>
                <Carousel className="mt-4">
                    <Carousel.Item interval={5000}>
                        <Image className="carousel-image d-block w-100" src="https://images.unsplash.com/photo-1520605728164-b6a5c6814203?q=80&w=2681&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"></Image>
                        <div className="carousel-overlay"></div>
                        <Carousel.Caption>
                            <h3>First slide label</h3>
                            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                            <div className="text-center">
                                <Button className="mt-3" size="lg" variant="dark" onClick={handleViewProductBtn}>View products</Button>
                            </div>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item interval={5000}>
                        <Image className="carousel-image d-block w-100" src="https://plus.unsplash.com/premium_photo-1673014201324-54bab699c3b4?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"></Image>
                        <div className="carousel-overlay"></div>
                        <Carousel.Caption>
                            <h3>Second slide label</h3>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                            <div className="text-center">
                                <Button className="mt-3" size="lg" variant="dark" onClick={handleViewProductBtn}>View products</Button>
                            </div>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item interval={5000}>
                        <Image className="carousel-image d-block w-100" src="https://images.unsplash.com/photo-1501876725168-00c445821c9e?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"></Image>
                        <div className="carousel-overlay"></div>
                        <Carousel.Caption>
                            <h3>Third slide label</h3>
                            <p>
                                Praesent commodo cursus magna, vel scelerisque nisl consectetur.
                            </p>
                            <div className="text-center">
                                <Button className="mt-3" size="lg" variant="dark" onClick={handleViewProductBtn}>View products</Button>
                            </div>
                        </Carousel.Caption>
                    </Carousel.Item>
                </Carousel>
            </div>
        </Container >)
}

export default HomePage