// server.ts
// Load environment variables FIRST before any other imports
import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server as SocketServer } from "socket.io";
import { setSocketIO } from "@/lib/notify";
import { auth } from "@/lib/auth";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

// Track online users: userId → Set<socketId>
const onlineUsers = new Map<string, Set<string>>();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  const io = new SocketServer(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
  });

  // Make io available to API routes
  setSocketIO(io);
  (global as any).__socketIO = io;

  // Auth middleware
  io.use(async (socket, next) => {
    try {
      // Validate session via Better Auth using headers (cookies)
      const session = await auth.api.getSession({
        headers: new Headers(socket.handshake.headers as any),
      });

      if (!session) return next(new Error("Invalid session"));

      const user = session.user as any;
      if (user.status === "SUSPENDED")
        return next(new Error("Account suspended"));

      socket.data.user = {
        id: user.id,
        name: user.name,
        role: user.role,
        email: user.email,
      };

      next();
    } catch (error) {
      console.error("WS Auth Error:", error);
      next(new Error("Authentication failed"));
    }
  });

  io.on("connection", (socket) => {
    const user = socket.data.user;
    const userId = user.id;

    // Join personal room
    socket.join(`user:${userId}`);

    // Join role rooms
    if (user.role === "ADMIN") socket.join("admins");
    if (user.role === "LECTURER") socket.join("lecturers");

    // Track online status
    if (!onlineUsers.has(userId)) onlineUsers.set(userId, new Set());
    onlineUsers.get(userId)!.add(socket.id);

    // Notify admins of online user
    io.to("admins").emit("user:status", {
      userId,
      online: true,
      name: user.name,
      role: user.role,
    });

    // ─── COURSE ROOMS ─────────────────────────
    socket.on("course:join", ({ courseId }: { courseId: string }) => {
      socket.join(`course:${courseId}`);
    });

    socket.on("course:leave", ({ courseId }: { courseId: string }) => {
      socket.leave(`course:${courseId}`);
    });

    // ─── MESSAGING ────────────────────────────
    socket.on(
      "message:send",
      async ({
        receiverId,
        content,
      }: {
        receiverId: string;
        content: string;
      }) => {
        // Save to DB via API (or directly here)
        io.to(`user:${receiverId}`).emit("message:new", {
          senderId: userId,
          senderName: user.name,
          content,
          sentAt: new Date().toISOString(),
        });
      },
    );

    socket.on("typing:start", ({ receiverId }: { receiverId: string }) => {
      io.to(`user:${receiverId}`).emit("typing:indicator", {
        senderId: userId,
        senderName: user.name,
        isTyping: true,
      });
    });

    socket.on("typing:stop", ({ receiverId }: { receiverId: string }) => {
      io.to(`user:${receiverId}`).emit("typing:indicator", {
        senderId: userId,
        isTyping: false,
      });
    });

    // ─── DISCONNECT ───────────────────────────
    socket.on("disconnect", () => {
      const sockets = onlineUsers.get(userId);
      if (sockets) {
        sockets.delete(socket.id);
        if (sockets.size === 0) {
          onlineUsers.delete(userId);
          io.to("admins").emit("user:status", { userId, online: false });
        }
      }
    });
  });

  const PORT = process.env.PORT || 3000;
  httpServer.listen(PORT, () => {
    console.log(`> AYii University ready on http://localhost:${PORT}`);
  });
});
