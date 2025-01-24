// 'use strict';

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) { },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }) {
    const { Server } = require("socket.io");

    // Initialize the WebSocket server
    const io = new Server(strapi.server.httpServer, {
      cors: {
        origin: "*", // Allow all origins (can be restricted to specific domains in production)
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true,
      },
    });


    io.on("connection", (socket) => {
      console.log(`Client connected: ${socket.id}`);

      // Handle incoming messages from clients
      socket.on("message", (msg) => {
        console.log(`Received message: ${msg}`);

        // Echo the message back to the client
        socket.emit("message", msg);
      });

      // Handle client disconnection
      socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
      });
    });

    // Attach the WebSocket instance to the Strapi instance
    strapi.io = io;

    console.log("WebSocket server initialized successfully.");
  },
};