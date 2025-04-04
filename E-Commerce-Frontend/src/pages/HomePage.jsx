import Container from 'react-bootstrap/Container'
import Carousel from 'react-bootstrap/Carousel';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import { useNavigate } from 'react-router-dom';
import { SLIDER_IMG_1, SLIDER_IMG_2, SLIDER_IMG_3 } from '../constants/constant';
function HomePage() {
    const navigate = useNavigate()
    const handleViewProductBtn = () => {
        navigate('/products')
    }
    return (
        <Container fluid>
            <div>
                <Carousel className="mt-4">
                    <Carousel.Item interval={5000}>
                        <Image className="carousel-image d-block w-100" src={SLIDER_IMG_1}></Image>
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
                        <Image className="carousel-image d-block w-100" src={SLIDER_IMG_2}></Image>
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
                        <Image className="carousel-image d-block w-100" src={SLIDER_IMG_3}></Image>
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