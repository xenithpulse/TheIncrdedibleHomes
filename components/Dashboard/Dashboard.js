import React, { useEffect, useState } from 'react';
import TrackingChart from './TrackingChart'; // This must match the exact export in TrackingChart.js
import TrackingTable from './TrackingTable'; // This must match the exact export in TrackingTable.js
import { DashboardContainer, Header, Dropdown, ChartWrapper, FullWidthChartCard, LoaderWrapper } from './StyledComponents'; // Ensure all these are correctly imported
import { BounceLoader } from 'react-spinners'; // BounceLoader must be imported from react-spinners

const TrackingDashboard = () => {
  const [trackingData, setTrackingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeframe, setTimeframe] = useState('7 Days');

  const timeframes = ['1 Hour','1 Day', '7 Days', '30 Days', 'All Time'];

  useEffect(() => {
    const fetchTrackingData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/trackingdata?timeframe=${timeframe}`);
        const data = await response.json();

        if (response.ok) {
          setTrackingData(data.data || []);
        } else {
          setError('Failed to fetch tracking data: ' + data.message);
        }
      } catch (err) {
        setError('Error fetching tracking data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrackingData();
  }, [timeframe]);

  if (loading) {
    return (
      <DashboardContainer>
        <LoaderWrapper>
          <BounceLoader color="#3498db" size={50} />
        </LoaderWrapper>
      </DashboardContainer>
    );
  }

  if (error) {
    return (
      <DashboardContainer>
        <div style={{ color: 'red' }}>{error}</div>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <Header>
        <Dropdown value={timeframe} onChange={(e) => setTimeframe(e.target.value)}>
          {timeframes.map((frame, index) => (
            <option key={index} value={frame}>{frame}</option>
          ))}
        </Dropdown>
      </Header>

      <ChartWrapper>
        <FullWidthChartCard>
          <TrackingChart trackingData={trackingData} timeframe={timeframe} />
        </FullWidthChartCard>
      </ChartWrapper>

      <TrackingTable trackingData={trackingData} />
    </DashboardContainer>
  );
};

export default TrackingDashboard;
