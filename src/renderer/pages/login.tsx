/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable prettier/prettier */
import {
  Button,
  Card,
  Col,
  FormControl,
  InputGroup,
  Row,
  Form,
} from 'react-bootstrap';
import { FormEvent, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from 'renderer/context/userContext';
import { getUsersQuantity, login } from 'renderer/service/users';
import CreateAdminModal from 'renderer/components/login/createAdminModal';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUser } from '@fortawesome/free-solid-svg-icons';

const {
  console,
} = window;

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showCreateAdminModal, setShowCreateAdminModal] = useState(false);
  const [canCreateAdmin, setCanCreateAdmin] = useState(false);

  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    (async () => {
      const response = await getUsersQuantity();
      if (response.isSuccess && !response.result) {
        setCanCreateAdmin(true);
      }
    })();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const response = await login(username, password);
    if (!response.isSuccess) {
      toast.error(response.message);
    } else {
      response.result && setUser?.(response.result);
      navigate('home/laundry-register');
    }
  };

  return (
    <section style={{ height: '100vh', backgroundColor: '#fff' }}>
      <CreateAdminModal
        show={showCreateAdminModal}
        toggle={setShowCreateAdminModal}
        onSuccess={() => setCanCreateAdmin(false)}
      />

      <div className="h-100">
        <Row className="justify-content-center h-100 g-0">
          <Col md="6" lg="4" className="h-100">
            <div className="d-flex align-items-center h-100">
              <div className="w-100 m-2">
                <Card className="shadow m-3">
                  <Card.Body>
                    <Form onSubmit={handleSubmit}>
                      <p className="text-center">Please log in to start</p>
                      <InputGroup className="mb-2">
                        <FormControl
                          className="border-right-0"
                          placeholder="Username"
                          onChange={(e) => setUsername(e.target.value)}
                        />
                        <InputGroup.Text>
                          <FontAwesomeIcon icon={faUser} />
                        </InputGroup.Text>
                      </InputGroup>
                      <InputGroup className="mb-2">
                        <FormControl
                          className="border-right-0"
                          type="password"
                          placeholder="Password"
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <InputGroup.Text>
                          <FontAwesomeIcon icon={faLock} />
                        </InputGroup.Text>
                      </InputGroup>
                      {canCreateAdmin && (
                        <p className="mb-1 mt-n1 text-center text-primary">
                          <small
                            onClick={() => setShowCreateAdminModal(true)}
                            style={{ cursor: 'pointer' }}
                          >
                            Create Admin Account
                          </small>
                        </p>
                      )}
                      <Button className="w-100 mt-2" type="submit">
                        Login
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default LoginPage;
