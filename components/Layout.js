import { useSession } from "next-auth/react";
import Nav from "@/components/Nav";
import { useState } from "react";
import Logo from "@/components/Logo";
import LoginPage from "@/pages/loginpage"; // Import custom login page
import styled from "styled-components";

// Styled Components for Layout
const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #000;
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background-color: #000;

  @media (min-width: 768px) {
    display: none;
  }
`;

const ContentArea = styled.div`
  display: flex;
  flex-grow: 1;
  width: 100%;
`;

const MainContent = styled.div`
  flex-grow: 1;
  padding: 20px;
  background-color: #000;
`;

const LoadingScreen = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #000000;
  color: #ffffff;
  height: 100vh;
`;

export default function Layout({ children }) {
  const [showNav, setShowNav] = useState(false);
  const { data: session, status } = useSession();

  // Show loading state while session is being fetched
  if (status === "loading") {
    return (
      <LoadingScreen>
        <p>Loading...</p>
      </LoadingScreen>
    );
  }

  // Render custom login page if no session
  if (!session) {
    return <LoginPage />;
  }

  return (
    <LayoutContainer>
      <TopBar>
        <button onClick={() => setShowNav(true)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <Logo />
      </TopBar>
      <ContentArea>
        <Nav show={showNav} />
        <MainContent>{children}</MainContent>
      </ContentArea>
    </LayoutContainer>
  );
}
