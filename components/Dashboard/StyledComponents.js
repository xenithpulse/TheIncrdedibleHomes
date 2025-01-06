import styled from "styled-components";

export const DashboardContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #000;
  min-height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;

  @media (max-width: 768px) {
    padding: 15px;
    gap: 15px;
  }
`;

export const Header = styled.h2`
  font-size: 32px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 20px;
`;

export const Dropdown = styled.select`
  padding: 4px 8px;
  font-size: 14px;
  border-radius: 4px;
  border: 1px solid #ddd;
  background-color: #000;
  color: #fff;
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 10px;
  width: auto;
  max-width: 200px;
`;

export const ChartWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

export const FullWidthChartCard = styled.div`
  background-color: #000;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 100%;
  min-height: 300px;
`;

export const TableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 101.5%;
  padding: 10px;
  background-color: #000;

  .row {
    display: flex;
    gap: 10px;
    justify-content: space-between;
    width: 100%;
  }

  .second-row {
    .HalfWidthTableCard {
      flex: 1;
      min-width: 100px;
    }
  }
`;

export const HalfWidthTableCard = styled.div`
  background-color: #000;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 100%;
  flex: 1;
  overflow: hidden; /* Ensure text does not push layout */
  position: relative;

  &:nth-child(1), &:nth-child(2) {
    flex: 0.5;
  }

  &:nth-child(3), &:nth-child(4), &:nth-child(5) {
    flex: 0.5;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  color: #fff;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);

  th, td {
    padding: 5px;
    text-align: left;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 235px; /* Limit max character width */
  }
`;

export const ProgressBar = styled.div`
  width: 180px;
  background-color: transparent;
  height: 6px;
  border-radius: 4px;
  margin-top: 5px;
  position: relative;
  opacity: 0.7;
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${({ percentage }) => percentage}%;
    background: linear-gradient(to right, #4caf50, #66bb6a);
    border-radius: 0%;
    opacity: 0.7;
  }
`;

export const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
`;

export const SeeAllButton = styled.button`
  margin-top: 10px;
  background-color: #4caf50;
  color: #fff;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  align-self: center;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #66bb6a;
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background: #000;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 800px;
  max-height: 90%;
  overflow-y: auto;
  color: #fff;
  position: relative;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  color: #fff;
  font-size: 18px;
  cursor: pointer;

  &:hover {
    color: #f00;
  }
`;
