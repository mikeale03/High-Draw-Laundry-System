import { useContext } from 'react';
import {
  faCartArrowDown,
  faCartShopping,
  faCashRegister,
  faChartLine,
  faCog,
  faMobileRetro,
  faMoneyBillTransfer,
  faPersonDigging,
  faPesoSign,
  faPhone,
  faShirt,
  faSocks,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink } from 'react-router-dom';
import UserContext from 'renderer/context/userContext';
import useCashRegisterStore from 'renderer/store/cashRegisterStore';

const Sidebar = () => {
  const { user } = useContext(UserContext);
  const { hasItems } = useCashRegisterStore((state) => state);
  return (
    <nav
      className="px-0 h-100 position-fixed bg-light shadow d-flex flex-column"
      style={{
        width: '130px',
        left: 0,
        top: 0,
        paddingTop: '50px',
      }}
    >
      <div
        className="scroll-sm h-100 overflow-auto"
        style={user?.role === 'admin' ? { marginBottom: '65px' } : undefined}
      >
        <ul className="nav flex-column mt-3">
          <NavLink to="laundry-register" className="mb-3">
            {({ isActive }) => (
              <li
                className={`nav-link cursor-pointer text-center rounded bg-white mx-3 py-3 px-0 transition-all
              ${isActive && 'active'}`}
                style={{ fontSize: '0.8em' }}
              >
                <FontAwesomeIcon
                  icon={faShirt}
                  size="lg"
                  className="color-primary"
                />
                <p className="m-0 text-center">Laundry Register</p>
              </li>
            )}
          </NavLink>
          <NavLink to="laundry-entries" className="mb-3">
            {({ isActive }) => (
              <li
                className={`nav-link cursor-pointer text-center rounded bg-white mx-3 py-3 px-0 transition-all
              ${isActive && 'active'}`}
                style={{ fontSize: '0.8em' }}
              >
                <FontAwesomeIcon
                  icon={faSocks}
                  size="lg"
                  className="color-primary"
                />
                <p className="m-0 text-center">Laundry Entries</p>
              </li>
            )}
          </NavLink>
          <NavLink to="cash-register" className="mb-3">
            {({ isActive }) => (
              <li
                className={`nav-link cursor-pointer text-center rounded bg-white mx-3 py-3 px-0 transition-all
              ${isActive && 'active'}`}
                style={{ fontSize: '0.8em' }}
              >
                <FontAwesomeIcon
                  icon={faCashRegister}
                  size="lg"
                  className="color-primary"
                />
                <p className="m-0 text-center">Cash Register</p>
              </li>
            )}
          </NavLink>
          <NavLink
            to="gcash-register"
            className="mb-3"
            style={hasItems ? { pointerEvents: 'none' } : {}}
          >
            {({ isActive }) => (
              <li
                className={`nav-link cursor-pointer text-center rounded bg-white mx-3 py-3 px-0 transition-all
            ${isActive && 'active'}`}
                style={{ fontSize: '0.8em' }}
              >
                <FontAwesomeIcon
                  icon={faMobileRetro}
                  size="lg"
                  className="color-primary"
                />
                <p className="m-0 text-center">GCash Register</p>
              </li>
            )}
          </NavLink>
          <NavLink
            to="mobile-load"
            className="mb-3"
            style={hasItems ? { pointerEvents: 'none' } : {}}
          >
            {({ isActive }) => (
              <li
                className={`nav-link cursor-pointer text-center rounded bg-white mx-3 py-3 px-0 transition-all
            ${isActive && 'active'}`}
                style={{ fontSize: '0.8em' }}
              >
                <FontAwesomeIcon
                  icon={faMobileRetro}
                  size="xl"
                  className="color-primary"
                />
                <p className="m-0 text-center">Mobile Load</p>
              </li>
            )}
          </NavLink>
          <NavLink
            to="products"
            className="mb-3"
            style={hasItems ? { pointerEvents: 'none' } : {}}
          >
            {({ isActive }) => (
              <li
                className={`nav-link cursor-pointer text-center rounded bg-white mx-3 py-3 px-0 transition-all
            ${isActive && 'active'}`}
                style={{ fontSize: '0.8em' }}
              >
                <FontAwesomeIcon
                  icon={faCartShopping}
                  size="lg"
                  className="color-primary"
                />
                <p className="m-0 text-center">Products</p>
              </li>
            )}
          </NavLink>
          <NavLink
            to="sales"
            className="mb-3"
            style={hasItems ? { pointerEvents: 'none' } : {}}
          >
            {({ isActive }) => (
              <li
                className={`nav-link cursor-pointer text-center rounded bg-white mx-3 py-3 px-0 transition-all
            ${isActive && 'active'}`}
                style={{ fontSize: '0.8em' }}
              >
                <FontAwesomeIcon
                  icon={faPesoSign}
                  size="lg"
                  className="color-primary"
                />
                <p className="m-0 text-center">Sales</p>
              </li>
            )}
          </NavLink>
          <NavLink
            to="gcash-transactions"
            className="mb-3"
            style={hasItems ? { pointerEvents: 'none' } : {}}
          >
            {({ isActive }) => (
              <li
                className={`nav-link cursor-pointer text-center rounded bg-white mx-3 py-3 px-0 transition-all
            ${isActive && 'active'}`}
                style={{ fontSize: '0.8em' }}
              >
                <FontAwesomeIcon
                  icon={faMoneyBillTransfer}
                  size="lg"
                  className="color-primary"
                />
                <p className="m-0 text-center">GCash Trans.</p>
              </li>
            )}
          </NavLink>
          <NavLink
            to="customers"
            className="mb-3"
            style={hasItems ? { pointerEvents: 'none' } : {}}
          >
            {({ isActive }) => (
              <li
                className={`nav-link cursor-pointer text-center rounded bg-white mx-3 py-3 px-0 transition-all
            ${isActive && 'active'}`}
                style={{ fontSize: '0.8em' }}
              >
                <FontAwesomeIcon
                  icon={faPhone}
                  size="lg"
                  className="color-primary"
                />
                <p className="m-0 text-center">Customers</p>
              </li>
            )}
          </NavLink>
          <NavLink
            to="expenses"
            className="mb-3"
            style={hasItems ? { pointerEvents: 'none' } : {}}
          >
            {({ isActive }) => (
              <li
                className={`nav-link cursor-pointer text-center rounded bg-white mx-3 py-3 px-0 transition-all
            ${isActive && 'active'}`}
                style={{ fontSize: '0.8em' }}
              >
                <FontAwesomeIcon
                  icon={faCartArrowDown}
                  size="lg"
                  className="color-primary"
                />
                <p className="m-0 text-center">Expenses</p>
              </li>
            )}
          </NavLink>
          <NavLink
            to="reports"
            className="mb-3"
            style={hasItems ? { pointerEvents: 'none' } : {}}
          >
            {({ isActive }) => (
              <li
                className={`nav-link cursor-pointer text-center rounded bg-white mx-3 py-3 px-0 transition-all
            ${isActive && 'active'}`}
                style={{ fontSize: '0.8em' }}
              >
                <FontAwesomeIcon
                  icon={faChartLine}
                  size="lg"
                  className="color-primary"
                />
                <p className="m-0 text-center">Reports</p>
              </li>
            )}
          </NavLink>
          <NavLink
            to="activities"
            className="mb-3"
            style={hasItems ? { pointerEvents: 'none' } : {}}
          >
            {({ isActive }) => (
              <li
                className={`nav-link cursor-pointer text-center rounded bg-white mx-3 py-3 px-0 transition-all
            ${isActive && 'active'}`}
                style={{ fontSize: '0.8em' }}
              >
                <FontAwesomeIcon
                  icon={faPersonDigging}
                  size="lg"
                  className="color-primary"
                />
                <p className="m-0 text-center">Activities</p>
              </li>
            )}
          </NavLink>
        </ul>
      </div>
      {user?.role === 'admin' && (
        <div className="container bg-white position-absolute bottom-0 start-0 p-2">
          <ul className="nav flex-column">
            <NavLink
              to="admin"
              className="mb-0"
              style={hasItems ? { pointerEvents: 'none' } : {}}
            >
              <li>
                <span className="nav-link cursor-pointer text-center">
                  <FontAwesomeIcon icon={faCog} className="color-primary" />
                  <strong className="color-primary"> Admin</strong>
                </span>
              </li>
            </NavLink>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Sidebar;
