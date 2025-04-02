import { useState } from "react";
import { useProduct } from '../../context/ProductContext'
import { useCart } from '../../context/CartContext'
import { useError } from '../../context/ErrorContext';
import Button from 'react-bootstrap/Button';
import ConfirmModal from '../common/ConfirmModal';
import { TIMED_OUT_ERR_MSG, NETWORK_ERR_MSG, TIMED_OUT_CASE } from '../../constants/constant'

function DeleteProductButton({ product }) {
    // contexts
    const { showError } = useError()
    const { deleteProduct } = useProduct()
    const { removeDeletedProductFromCart } = useCart()

    const [showConfirmModal, setShowConfirmModal] = useState(false)

    const handleClick = () => {
        setShowConfirmModal(true)
    }

    // This function deletes the product from backend and also calls cart context to remove product from cart if present.
    const confirmDeleteProduct = async () => {
        try {
            await deleteProduct(product.productId)
            removeDeletedProductFromCart(product.productId)
        } catch (err) {
            if (err.code === TIMED_OUT_CASE) {
                showError(TIMED_OUT_ERR_MSG)
            } else if (!err.response) {
                showError(NETWORK_ERR_MSG)
            } else {
                showError('Deleting the product failed, please try again')
            }
        }
        setShowConfirmModal(false)
    }

    return (
        <>
            <Button className="mb-1 mx-2" variant="danger" onClick={handleClick}>
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