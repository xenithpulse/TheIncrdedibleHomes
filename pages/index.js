import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import TrackingDashboard from "@/components/Dashboard/Dashboard";
import styled from "styled-components";
import { mongooseConnect } from "@/lib/mongoose";

const PageContainer = styled.div`
  background-color: #000;
  color: #fff;
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  position: relative;
`;

const DashboardWrapper = styled.div`
  background-color: #000;
  margin-top: -3%;
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;



const Header = styled.div`
position: absolute;
top: 0;
left: 35%;
margin-top: 16px;
text-align: center;

h2 {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 8px;
}

img {
  margin-left: 16px;
  width: 50px;
  height: 50px;
}
`;


export default function Home() {
  const { data: session } = useSession();

  useEffect(() => {
    const sendEmails = async () => {
      if (session) {
        try {
          console.log("User is logged in. Sending confirmation emails...");
          const response = await fetch("/api/sendEmail", {
            method: "POST",
          });
          if (response.ok) {
            console.log("Confirmation emails sent.");
          } else {
            console.error("Failed to send emails:", response.statusText);
          }
        } catch (error) {
          console.error("Error sending confirmation emails:", error);
        }
      }
    };

    sendEmails(); // Invoke the function on component mount
  }, [session]); // Dependency array includes `session` to run when it changes


  return (
    <Layout>
      <PageContainer>
        <Header>
          <h2>WELCOME TO THE SUDO PANEL</h2>
        </Header>
        <DashboardWrapper>
          <TrackingDashboard />
        </DashboardWrapper>
      </PageContainer>
    </Layout>
  );
}
