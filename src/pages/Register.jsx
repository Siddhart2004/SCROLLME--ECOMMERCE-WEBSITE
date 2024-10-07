import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { changeAuthenticated } from "../store/Slices/UserSlice";
import { useToast } from "@chakra-ui/react";
import { auth } from "../context/Firebase"; // Update import
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth"; // Import user creation method
import { FaGoogle } from 'react-icons/fa'; // Import Google icon
import { UserRegistrationAPI } from '../services/userAPI/registerationAPI';
import { useState } from 'react';
import { Triangle } from 'react-loader-spinner';
import { mobile, tablet } from '../responsive';
import PasswordStrengthBar from 'react-password-strength-bar';


const Container = styled.div`
    width: 100vw;
    height: 100vh;
    background: linear-gradient(
        rgba(255, 255, 255, 0.5),
        rgba(255, 255, 255, 0.5)
    ),
    url("https://images.pexels.com/photos/6984650/pexels-photo-6984650.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940")
    center;
    background-size: cover;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const PasswordBox = styled.div`
  width: 100%;
  padding: 2px 4px;
  height: fit-content;
`;

const Box = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 6px;
`;

const Text = styled.p`
  font-size: 12px;
`;

const Link = styled.a`
  font-size: 12px;
  margin: 5px 0px;
  text-decoration: underline;
  cursor: pointer;
`;

const Agreement = styled.span`
  font-size: 12px;
  margin: 20px 0px;
`;

const LoaderOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(255, 255, 255, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
`;

const Wrapper = styled.div`
    width: 25%;
    padding: 20px;
    background-color: white;
`;

const Title = styled.h1`
    font-size: 24px;
    font-weight: 300;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
`;

const Input = styled.input`
    flex: 1;
    min-width: 40%;
    margin: 10px 0;
    padding: 10px;
`;

const Button = styled.button`
    width: 40%;
    border: none;
    padding: 15px 20px;
    background-color: teal;
    color: white;
    cursor: pointer;
    margin-bottom: 10px;
`;

const GoogleButton = styled(Button)`
    background-color: #4285f4; /* Google blue color */
    width: 100%; /* Full width */
`;

const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const toast = useToast();
    const googleProvider = new GoogleAuthProvider();
    const [isLoading, setIsLoading] = useState(false);
    const [password, setPassword] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            toast({
                title: "Registration Successful",
                description: "You have successfully registered.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            dispatch(changeAuthenticated(true));
            navigate("/");
        } catch (error) {
            toast({
                title: "Registration Failed!",
                description: error.message || "Please try again.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            console.log(error);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            toast({
                title: "Google Login Successful",
                description: `Welcome ${user.displayName}!`, // Corrected syntax
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            dispatch(changeAuthenticated(true));
            navigate("/");
        } catch (error) {
            toast({
                title: "Google Login Failed!",
                description: "Please try again later.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            console.log(error);
        }
    };


  const validateForm = (formData) => {
    const { firstName, lastName, username, password } = formData;
    const namePattern = /^[a-zA-Z]+$/;
    if (firstName.length < 2 || !namePattern.test(firstName)) {
      // alert(
      //   'First name must be at least 2 characters long and contain only letters.'
      // );
      toast({
        title: 'Invalid First Name',
        description: 'First name must be at least 2 characters long and contain only letters.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return false;
    }
    if (lastName.length < 2 || !namePattern.test(lastName)) {
      // alert(
      //   'Last name must be at least 2 characters long and contain only letters.'
      // );
      toast({
        title: 'Invalid Last Name',
        description: 'Last name must be at least 2 characters long and contain only letters.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return false;
    }
    if (username.length < 2) {
      // alert('Username must be at least 2 characters long.');
      toast({
        title: 'Invalid Username',
        description: 'Username must be at least 2 characters long.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return false;
    }

    // Password Validation
    const passwordPattern = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}$/;
    if (!passwordPattern.test(password)) {
      // alert(
      //   'Password must be at least 8 characters long, contain at least one digit and one special character.'
      // );
      toast({
        title: 'Invalid Password',
        description: 'Password must be at least 8 characters long, contain at least one digit and one special character.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = {
      firstName: e.target.firstName.value,
      lastName: e.target.lastName.value,
      username: e.target.username.value,
      email: e.target.email.value,
      password: e.target.password.value,
      confirmPassword: e.target.confirmPassword.value,
    };

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Password Mismatch!',
        description: 'Passwords do not match, change the password!.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      setIsLoading(false);
      return;
    }
    // Form validation
    if (!validateForm(formData)) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const res = await UserRegistrationAPI(formData);
      toast({
        title: 'Registration Successful!',
        description: res.message || 'You have successfully registered. Welcome!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Registration Failed!',
        description: error || 'An error occurred during registration.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  return (
    <>
      {isLoading && (
        <LoaderOverlay>
          <Triangle
            color="teal"
            height={80}
            width={80}
            ariaLabel="triangle-loading"
          />
        </LoaderOverlay>
      )}
      <Container>
        <Wrapper>
          <Title>CREATE AN ACCOUNT</Title>
          <Form onSubmit={(e) => handleSubmit(e)}>
            <Input
              type="text"
              name="firstName"
              placeholder="first name"
              required
            />
            <Input
              type="text"
              name="lastName"
              placeholder="last name"
              required
            />
            <Input
              type="text"
              name="username"
              placeholder="username"
              required
            />
            <Input type="email" name="email" placeholder="email" required />
            <Input
              type="password"
              name="password"
              placeholder="password"
              required
              onChange={(e) => handlePassword(e)}
            />
            <Input
              type="password"
              name="confirmPassword"
              placeholder="confirm password"
              required
            />
            <PasswordBox>
              <PasswordStrengthBar password={password} />
            </PasswordBox>
            <Box>
              <Agreement>
                By creating an account, I consent to the processing of my
                personal data in accordance with the <b>PRIVACY POLICY</b>
              </Agreement>
              <Text>
                Already have an account? <Link href="/login">LOGIN</Link>
              </Text>
            </Box>
            <Button type="submit">CREATE</Button>
          </Form>
          <GoogleButton onClick={handleGoogleLogin}>
            <FaGoogle style={{ marginRight: '8px' }} /> Resiter With with Google
          </GoogleButton>
        </Wrapper>
      </Container>
    </>
  );
};

export default Register;
