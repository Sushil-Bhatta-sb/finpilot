// Singleton holder for the Socket.io server instance so controllers can emit
// events without creating a circular dependency on server.js.
let io = null;

function initIO(server, options) {
  const { Server } = require('socket.io');
  io = new Server(server, options);

  io.on('connection', (socket) => {
    // Client emits `join` with their userId; join a private room for that user.
    socket.on('join', (userId) => {
      if (userId) socket.join(String(userId));
    });
  });

  return io;
}

function getIO() {
  if (!io) throw new Error('Socket.io not initialized. Call initIO first.');
  return io;
}

// Safe emit helper: no-ops if io is not initialized (e.g. during tests).
function emitToUser(userId, event, payload) {
  if (!io) return;
  io.to(String(userId)).emit(event, payload);
}

module.exports = { initIO, getIO, emitToUser };
