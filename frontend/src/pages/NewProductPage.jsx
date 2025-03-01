import NewProductForm from "../components/NewProductForm"
import Container from 'react-bootstrap/Container';
function NewProductPage() {
    return (
        <Container className="mt-5">
            <h1 className="text-center mb-4">Add New Product</h1>
            <NewProductForm></NewProductForm>
        </Container>
    )
}

export default NewProductPage;