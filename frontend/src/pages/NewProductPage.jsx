import NewProductForm from "../components/NewProductForm"
import ManageUserPanel from "../components/ManageUserPanel"
import Container from 'react-bootstrap/Container';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
function NewProductPage() {
    return (
        <Container className="mt-5">
            <Tabs defaultActiveKey="product">
                <Tab eventKey="product" title="Update Products">
                    <h1 className="text-center mb-4">Add New Product</h1>
                    <NewProductForm></NewProductForm>
                </Tab>
                <Tab eventKey="user" title="Update Users">

                    <ManageUserPanel></ManageUserPanel>
                </Tab>
            </Tabs>

        </Container>
    )
}

export default NewProductPage;