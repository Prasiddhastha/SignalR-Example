import React, { useState, useEffect } from "react";
import * as signalR from "@microsoft/signalr";

const NotificationComponent = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Connect to SignalR hub
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:44319/notification-hub")
      .build();

    // Start the connection
    connection
      .start()
      .then(() => {
        console.log("SignalR Connected");
      })
      .catch((err) => console.error("SignalR Connection Error: ", err));

    // Listen for notifications
    connection.on("ReceiveNotification", (notification) => {
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        notification,
      ]);
    });

    return () => {
      // Cleanup - stop the connection when component unmounts
      connection
        .stop()
        .then(() => console.log("SignalR Connection Stopped"))
        .catch((err) => console.error("SignalR Stop Connection Error: ", err));
    };
  }, []); // Run effect only once on mount

  return (
    <div>
      <h1>Notifications</h1>
      <ul>
        {notifications.map((notification) => (
          <li key={notification.id}>{notification.message}</li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationComponent;
