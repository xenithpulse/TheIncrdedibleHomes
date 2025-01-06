import React from 'react';
import { Table, HalfWidthTableCard, TableWrapper, ProgressBar } from './StyledComponents';

const TrackingTable = ({ trackingData }) => {

  const calculatePercentage = (count, total) => {
    return ((count / total) * 100).toFixed(2);
  };

  const getTotalUniqueVisitors = () => {
    const uniqueSessions = new Set(trackingData.map(item => item.sessionId));
    return uniqueSessions.size;
  };

  const getUniqueVisitorsByPage = () => {
    const pageViewMap = {};

    trackingData.forEach((item) => {
      if (!pageViewMap[item.page]) {
        pageViewMap[item.page] = new Set();
      }
      pageViewMap[item.page].add(item.sessionId);
    });

    return Object.entries(pageViewMap).map(([page, sessions]) => ({
      page,
      uniqueVisitors: sessions.size,
    }));
  };

  const getReferrerData = () => {
    const referrerMap = {};

    trackingData.forEach((item) => {
      if (!referrerMap[item.referrer]) {
        referrerMap[item.referrer] = new Set();
      }
      referrerMap[item.referrer].add(item.sessionId);
    });

    return Object.entries(referrerMap).map(([referrer, sessions]) => ({
      referrer,
      uniqueVisitors: sessions.size,
    }));
  };

  const getCountryData = (totalVisitors) => {
    const countryMap = {};

    trackingData.forEach((item) => {
      if (!countryMap[item.country]) {
        countryMap[item.country] = new Set();
      }
      countryMap[item.country].add(item.sessionId);
    });

    return Object.entries(countryMap).map(([country, sessions]) => ({
      country,
      percentage: calculatePercentage(sessions.size, totalVisitors),
    }));
  };

  const getBrowserData = (totalVisitors) => {
    const browserMap = {};

    trackingData.forEach((item) => {
      if (!browserMap[item.device.browser]) {
        browserMap[item.device.browser] = new Set();
      }
      browserMap[item.device.browser].add(item.sessionId);
    });

    return Object.entries(browserMap).map(([browser, sessions]) => ({
      browser,
      percentage: calculatePercentage(sessions.size, totalVisitors),
    }));
  };

  const getOSData = (totalVisitors) => {
    const osMap = {};

    trackingData.forEach((item) => {
      if (!osMap[item.device.os]) {
        osMap[item.device.os] = new Set();
      }
      osMap[item.device.os].add(item.sessionId);
    });

    return Object.entries(osMap).map(([os, sessions]) => ({
      os,
      percentage: calculatePercentage(sessions.size, totalVisitors),
    }));
  };

  const totalUniqueVisitors = getTotalUniqueVisitors();

  return (
    <TableWrapper>
      <div className="row">
        <HalfWidthTableCard>
          <Table>
            <thead>
              <tr>
                <th>Pages</th>
                <th>Visitors</th>
              </tr>
            </thead>
            <tbody>
              {getUniqueVisitorsByPage().map((item, index) => (
                <tr key={index}>
                  <td>{item.page}</td>
                  <td>{item.uniqueVisitors}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </HalfWidthTableCard>

        <HalfWidthTableCard>
          <Table>
            <thead>
              <tr>
                <th>Referrers</th>
                <th>Visitors</th>
              </tr>
            </thead>
            <tbody>
              {getReferrerData().map((item, index) => (
                <tr key={index}>
                  <td>{item.referrer}</td>
                  <td>{item.uniqueVisitors}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </HalfWidthTableCard>
      </div>

      <div className="row second-row">
        <HalfWidthTableCard>
          <Table>
            <thead>
              <tr>
                <th>Countries</th>
                <th>Visitors</th>
              </tr>
            </thead>
            <tbody>
              {getCountryData(totalUniqueVisitors).map((item, index) => (
                <tr key={index}>
                  <td>                     <ProgressBar percentage={item.percentage} />
                  {item.country}</td>
                  <td>
                    {item.percentage}%
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </HalfWidthTableCard>

        <HalfWidthTableCard>
          <Table>
            <thead>
              <tr>
                <th>Browser</th>
                <th>Visitors</th>
              </tr>
            </thead>
            <tbody>
              {getBrowserData(totalUniqueVisitors).map((item, index) => (
                <tr key={index}>
                  <td>                     <ProgressBar percentage={item.percentage} />
                  {item.browser}</td>
                  <td>
                    {item.percentage}%
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </HalfWidthTableCard>

        <HalfWidthTableCard>
          <Table>
            <thead>
              <tr>
                <th>OS</th>
                <th>Visitors</th>
              </tr>
            </thead>
            <tbody>
              {getOSData(totalUniqueVisitors).map((item, index) => (
                <tr key={index}>
                  <td>           
                  <ProgressBar percentage={item.percentage} />
                  {item.os}</td>
                  <td >
                    {item.percentage}%
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </HalfWidthTableCard>
      </div>
    </TableWrapper>
  );
};

export default TrackingTable;
