import React, { useEffect, useState } from 'react';
declare var google: any;
import jwt_decode from 'jwt-decode';
import { GSI_CLIENT_ID } from './config';
import { LoginView } from './view';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface User {
  picture?: string;
  name?: string;
  sub?: string;
  [key: string]: any;
}

const Login: React.FC = () => {
  // State to hold the user's information
  const [user, setUser] = useState<User>({});
  const navigate = useNavigate();

  // Callback function to handle the response after Google Sign-In
  const handleCallbackResponse = (response: any) => {
    console.log('Encoded JWT ID token: ' + response.credential);
    // Decode the JWT token to get user's information
    const user_object = jwt_decode(response.credential) as User;
    console.log(user_object);
    // Update the user state with the decoded information
    setUser(user_object);

    // Send the JWT ID token to the backend
    sendTokenToBackend(response.credential);
  };

  const sendTokenToBackend = async (token: string) => {
    try {
      const response = await axios.post(
        'YourBackendEndpoint',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Token sent successfully:', response.data);

      //if successfully send the token, navigate to home page
      navigate('/home');
    } catch (error) {
      console.error('Error sending token:', error);
    }
  };

  // Function to handle user sign out
  const handleSignOut = (event: any) => {
    // Reset the user state to empty
    setUser({});
    // Re-render the Google Sign-In button after signing out
    google.accounts.id.renderButton(document.getElementById('signInDiv'), {
      theme: 'outline',
      size: 'large',
    });
  };

  // UseEffect hook to initialize Google Sign-In button on component mount
  useEffect(() => {
    // Initialize Google Sign-In with client ID and callback function
    google.accounts.id.initialize({
      client_id: GSI_CLIENT_ID,
      callback: handleCallbackResponse,
    });

    // Render the Google Sign-In button
    google.accounts.id.renderButton(document.getElementById('signInDiv'), {
      theme: 'outline',
      size: 'large',
      width: '400px',
    });
  }, []);

  // Render the LoginView component and pass user and handleSignOut as props
  return <LoginView user={user} handleSignOut={handleSignOut} />;
};

export default Login;
