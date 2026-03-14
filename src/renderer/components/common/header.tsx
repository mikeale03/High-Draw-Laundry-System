import { useContext } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import UserContext from 'renderer/context/userContext';

const Header = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const logout = () => {
    navigate('/');
  };
  return (
    <header
      className="position-fixed w-100 bg-white px-3 d-flex justify-content-between top-0 start-0 align-items-center shadow-sm"
      style={{ height: '50px', zIndex: 999 }}
    >
      <div>
        <p className="m-0">High Draw Laundry System</p>
      </div>
      <div>
        <span className="me-5 fw-bold">{user?.username}</span>
        <Button size="sm" onClick={logout}>
          log out
        </Button>
      </div>
    </header>
  );
};

export default Header;
