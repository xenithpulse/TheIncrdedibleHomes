import styled from "styled-components";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { BounceLoader } from "react-spinners";

const SignInContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(225deg, #000000 50%, #4C6FBA 100%);
  background-size: 200% 200%;
  animation: gradientMovement 10s ease-in-out infinite;

  font-family: 'poppins', sans-serif;

  @keyframes gradientMovement {
    0% {
      background-position: 0% 0%;
    }
    25% {
      background-position: 100% 50%;
    }
    50% {
      background-position: 50% 100%;
    }
    75% {
      background-position: 0% 100%;
    }
    100% {
      background-position: 50% 0%;
    }
  }
`;



const SignInBox = styled.div`
  width: 400px;
  padding: 40px;
  border-radius: 12px;
  background: transparent;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 28px;
  color: white;
  margin-bottom: 20px;
  font-weight: bold;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: white;
  margin-bottom: 30px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  border: 0.3px solid grey;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  background-color: transparent;
  color: white;
  transition: border 0.2s;

  &:focus {
    border-color: #3498db;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #3498db;
  color: #ffffff;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    background-color: #2980b9;
    transform: scale(1.02);
  }

  &:active {
    background-color: #1f5e82;
  }

  &:disabled {
    background-color: #dcdcdc;
    cursor: not-allowed;
  }
`;

const ErrorText = styled.p`
  color: red;
  font-size: 14px;
  margin-bottom: 20px;
`;

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

export default function SignIn() {
  const router = useRouter();
  const { error } = router.query;
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (event) => {
    event.preventDefault();
    setLoading(true);
    const username = event.target.username.value;
    const password = event.target.password.value;

    await signIn("credentials", {
      username,
      password,
      callbackUrl: "/admin",
    }).finally(() => setLoading(false));
  };

  return (
    <SignInContainer>
      <SignInBox>
        <Title>Welcome Back</Title>
        <Subtitle>Sign in to access the admin panel</Subtitle>
        {error && <ErrorText>Invalid credentials. Please try again.</ErrorText>}
        <form onSubmit={handleSignIn}>
          <Input type="text" name="username" placeholder="Username" required disabled={loading} />
          <Input type="password" name="password" placeholder="Password" required disabled={loading} />
          <Button type="submit" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </form>
        {loading && (
          <LoaderWrapper>
            <BounceLoader color="#3498db" size={50} />
          </LoaderWrapper>
        )}
      </SignInBox>
    </SignInContainer>
  );
}