import { useProduct } from '../context/ProductContext'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ProductCard from "./ProductCard";
import UpdateProductButton from './UpdateProductButton';
function ManageProductPanel() {
    const { products, updateProduct, deleteProduct } = useProduct()



    return (
        <>
            <Row>
                {products.map((product) => (
                    <Col key={product.productId} lg={3} className="mb-4">
                        <ProductCard
                            product={product}
                            CustomButton={
                                <UpdateProductButton
                                    product={product}>
                                </UpdateProductButton>}>
                        </ProductCard>
                    </Col>
                ))}
            </Row>
        </>)
}

export default ManageProductPanel