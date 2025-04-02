import Container from 'react-bootstrap/Container';
import { useSearchParams } from "react-router-dom";

function SuccessPage() {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get("orderId");
    return (
        <Container className="mt-5">
            <h1>Thank you for your order</h1>
            <h3 className="mb-4">Order number is #{orderId}</h3>
        </Container>
    )
}

export default SuccessPage;