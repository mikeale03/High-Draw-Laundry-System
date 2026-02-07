import { Col, Row } from 'react-bootstrap';

const LaundryEntriesPage = () => {
  return (
    <div>
      <h3>Laundry Entries</h3>
      <Row>
        <Col lg="8">
          <div className="cursor-pointer text-center rounded bg-white transistion-all">
            DROP-OFF
          </div>
          <div>SELF SERVICE</div>
        </Col>
      </Row>
    </div>
  );
};

export default LaundryEntriesPage;
