/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import { LaundryService } from 'globalTypes/realm/laundry.types';
import { laundryServicePriceRecord } from 'globalUtils/constants';
import { useEffect, useRef } from 'react';

type Props = {
  service: LaundryService;
  onSelect: (service: LaundryService) => void;
  deliveryOnly: boolean;
};

export const checkIsDeliveryService = (service: LaundryService) =>
  service === 'pickup and delivery' || service === 'pickup only';

export const checkIsSelfService = (service: LaundryService) =>
  service === 'wash and dry' || service === 'wash only';

const ServiceOptions = ({ service, onSelect, deliveryOnly = false }: Props) => {
  const dropOffOptionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dropOffOptionRef.current?.focus();
  }, []);

  return (
    <div className="d-flex mb-3">
      {!deliveryOnly && (
        <div
          ref={dropOffOptionRef}
          className={`cursor-pointer rounded-4 bg-white me-3 py-2 px-4 border transition-all
          ${
            service === 'drop-off'
              ? 'border-primary'
              : 'border-white text-muted'
          }`}
          tabIndex={0}
          onKeyDown={(e) =>
            e.key === 'Enter' && service !== 'drop-off' && onSelect('drop-off')
          }
          style={{ width: '240px' }}
          onClick={() => service !== 'drop-off' && onSelect('drop-off')}
        >
          <p className="m-0">P{laundryServicePriceRecord['drop-off']}</p>
          <h5 className="m-0">DROP-OFF</h5>
        </div>
      )}
      {!deliveryOnly && (
        <div
          className={`cursor-pointer rounded-4 bg-white me-3 py-2 px-4 border transition-all
          ${
            checkIsSelfService(service)
              ? 'border-primary'
              : 'border-white text-muted'
          }`}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              !checkIsSelfService(service) && onSelect('wash and dry');
            }
          }}
          style={{ width: '240px' }}
          onClick={() =>
            !checkIsSelfService(service) && onSelect('wash and dry')
          }
        >
          <p className="m-0">
            P
            {
              laundryServicePriceRecord[
                checkIsSelfService(service) ? service : 'wash and dry'
              ]
            }
          </p>
          <h5 className="m-0">SELF-SERVICE</h5>
        </div>
      )}
      <div
        className={`cursor-pointer rounded-4 bg-white me-3 py-2 px-4 border transition-all d-flex justify-content-center align-items-center
          ${
            checkIsDeliveryService(service)
              ? 'border-primary'
              : ' border-white text-muted'
          }`}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            !checkIsDeliveryService(service) && onSelect('pickup and delivery');
          }
        }}
        style={{ width: '255px' }}
        onClick={() =>
          !checkIsDeliveryService(service) && onSelect('pickup and delivery')
        }
      >
        {/* <p className="m-0">&ensp;</p> */}
        <h5 className="m-0">PICKUP AND DELIVERY</h5>
      </div>
    </div>
  );
};

export default ServiceOptions;
