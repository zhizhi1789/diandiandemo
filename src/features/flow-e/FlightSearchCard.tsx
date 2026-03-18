import { useState } from 'react';
import StructuredCard from '@/components/StructuredCard';
import styles from './FlightSearchCard.module.css';

interface FlightLeg {
  date: string;
  dayOfWeek: string;
  departureTime: string;
  departureAirport: string;
  arrivalTime: string;
  arrivalAirport: string;
}

interface FlightData {
  outbound: FlightLeg;
  inbound: FlightLeg;
  airline: string;
  price: number;
  currency: string;
}

interface FlightSearchCardProps {
  flight: FlightData;
  onSelect: (optionId: string) => void;
}

export default function FlightSearchCard({ flight, onSelect }: FlightSearchCardProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (optionId: string) => {
    if (selectedId) return; // 已选择，不可更改
    setSelectedId(optionId);
    onSelect(optionId);
  };

  const renderLeg = (leg: FlightLeg, label: string) => (
    <div className={styles.flightLeg}>
      <div className={styles.legDate}>{label} · {leg.date} {leg.dayOfWeek}</div>
      <div className={styles.legRoute}>
        <div className={styles.legEndpoint}>
          <span className={styles.legTime}>{leg.departureTime}</span>
          <span className={styles.legAirport}>{leg.departureAirport}</span>
        </div>
        <span className={styles.legArrow}>→</span>
        <div className={styles.legEndpoint}>
          <span className={styles.legTime}>{leg.arrivalTime}</span>
          <span className={styles.legAirport}>{leg.arrivalAirport}</span>
        </div>
      </div>
    </div>
  );

  return (
    <StructuredCard>
      <div className={styles.header}>
        <span className={styles.title}>✈️ 找到1个合适的航班</span>
        <span className={styles.subtitle}>满足你的时间和价格要求</span>
      </div>

      <div className={styles.flightInfo}>
        {renderLeg(flight.outbound, '去程')}
        {renderLeg(flight.inbound, '回程')}
        <div className={styles.airlineRow}>
          <span className={styles.airline}>{flight.airline}</span>
          <span className={styles.price}>
            {flight.currency}{flight.price.toLocaleString()}
          </span>
        </div>
      </div>

      {selectedId ? (
        <div className={styles.selectedBadge}>
          ✓ {selectedId === 'confirm-purchase' ? '已确认购买' : '继续观察中'}
        </div>
      ) : (
        <div className={styles.actions}>
          <button
            className={`${styles.actionBtn} ${styles.actionSecondary}`}
            onClick={() => handleSelect('keep-watching')}
          >
            继续观察
          </button>
          <button
            className={`${styles.actionBtn} ${styles.actionPrimary}`}
            onClick={() => handleSelect('confirm-purchase')}
          >
            确认购买
          </button>
        </div>
      )}
    </StructuredCard>
  );
}
