import React, { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NotificationComponent = () => {
  const [connection, setConnection] = useState(null);

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    const role = 'admin'; // Hardcoded role for demo, replace with actual role logic

    // Define the SignalR hub URL based on the user's role
    let hubUrl = '';
    switch (role) {
      case 'admin':
        hubUrl = 'https://pharma-release.server247.info/admin-hub';
        break;
      case 'manager':
        hubUrl = 'https://pharma-release.server247.info/manager-hub';
        break;
      case 'user':
        hubUrl = 'https://pharma-release.server247.info/user-hub';
        break;
      default:
        hubUrl = ''; // Default URL or handle error
        break;
    }
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => authToken,
      })
      .withAutomaticReconnect()
      .build();

    newConnection.on('ReceiveNotification', (message) => {
      console.log('Notification received:', message);
      toast.info(message, { autoClose: 5000 });
    });

    setConnection(newConnection);

    return () => {
      if (newConnection) {
        newConnection.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (connection) {
      connection.start()
        .then(() => {
          console.log('SignalR connection started successfully!');
        })
        .catch((error) => {
          console.error('Error starting SignalR connection:', error);
          toast.error('Failed to connect to real-time notifications');
        });
    }
  }, [connection]);

  return (
    <div>
      <h1>Notifications</h1>
      <ToastContainer />
    </div>
  );
};

export default NotificationComponent;