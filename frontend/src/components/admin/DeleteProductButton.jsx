import Button from 'react-bootstrap/Button';
import { useState } from "react";
import { useProduct } from '../../context/ProductContext'
import { useCart } from '../../context/CartContext'
import ConfirmModal from '../common/ConfirmModal';
function DeleteProductButton({ product }) {

    const { deleteProduct } = useProduct()
    const { removeDeletedProductFromCart } = useCart()
    const [showConfirmModal, setShowConfirmModal] = useState(false)

    const handleClick = () => {
        setShowConfirmModal(true)
    }

    const confirmDeleteProduct = async () => {
        await deleteProduct(product.productId)
        removeDeletedProductFromCart(product.productId)
        setShowConfirmModal(false)
    }

    return (
        <>
            <Button className="mt-auto mb-1 mx-2" variant="danger" onClick={handleClick}>
                Delete Product
            </Button>
            <ConfirmModal
                modalTitle="Confirm Product Deletion"
                modalBody="Are you sure you want to delete this product?"
                handleConfirm={confirmDeleteProduct}
                showModal={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
            >
            </ConfirmModal>
        </>)

}

export default DeleteProductButton