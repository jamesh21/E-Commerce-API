import { useProduct } from '../context/ProductContext'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ProductCard from "./ProductCard";
import UpdateProductButton from './UpdateProductButton';
import DeleteProductButton from './DeleteProductButton';
function ManageProductPanel() {
    const { products } = useProduct()

    return (
        <>
            <Row>
                {products.map((product) => (
                    <Col key={product.productId} lg={3} className="mb-4">
                        <ProductCard
                            product={product}
                            CustomButton={
                                <DeleteProductButton product={product}></DeleteProductButton>
                                // <UpdateProductButton
                                //     product={product}
                                // >
                                // </UpdateProductButton>
                            }>
                        </ProductCard>

                    </Col>

                ))}
            </Row>

        </>)
}

export default ManageProductPanel