import NewProductPanel from "../components/admin/NewProductPanel"
import ManageUserPanel from "../components/admin/ManageUserPanel"
import ManageProductPanel from "../components/admin/ManageProductPanel"
import Container from 'react-bootstrap/Container';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

function ManagePage() {
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

export default ManagePage;