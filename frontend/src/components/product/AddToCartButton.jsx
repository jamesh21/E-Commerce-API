import Spinner from 'react-bootstrap/Spinner'
import Button from 'react-bootstrap/Button';
import { useState } from "react";

function AddToCartButton({ product, handleAddToCart }) {
    const [loading, setLoading] = useState(false)

    const handleClick = async () => {
        setLoading(true)
        await handleAddToCart(product)

        setTimeout(() => {
            setLoading(false)
        }, 750)
    }

    return (
        <Button className="mt-auto mb-1 mx-2" variant={product.stock === 0 ? "secondary" : "dark"} onClick={handleClick} disabled={loading || product.stock === 0}>
            {loading ?
                (
                    <>
                        <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="me-2"
                        />
                        Adding...
                    </>
                )
                : product.stock === 0 ? ("Out of Stock") : ("Add to Cart")
            }
        </Button>)
}

export default AddToCartButton
