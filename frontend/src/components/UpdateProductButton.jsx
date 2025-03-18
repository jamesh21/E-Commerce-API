import Button from 'react-bootstrap/Button';
function UpdateProductButton({ product }) {

    return (
        <Button className="mt-auto mb-1 mx-2" variant="dark" onClick={() => { console.log('update product') }}>
            Update Product
        </Button>
    )
}

export default UpdateProductButton