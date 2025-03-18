import NewProductPanel from "../components/NewProductPanel"
import ManageUserPanel from "../components/ManageUserPanel"
import ManageProductPanel from "../components/ManageProductPanel"
import Container from 'react-bootstrap/Container';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

function NewProductPage() {
    return (
        <Container className="mt-5">
            <Tabs defaultActiveKey="add-product" className="mb-5">
                <Tab eventKey="add-product" title="Add Products">
                    <NewProductPanel></NewProductPanel>
                </Tab>
                <Tab eventKey="update-product" title="Update Products">

                    <ManageProductPanel></ManageProductPanel>
                </Tab>
                <Tab eventKey="user" title="Update Users">
                    <ManageUserPanel></ManageUserPanel>
                </Tab>
            </Tabs>

        </Container>
    )
}

export default NewProductPage;