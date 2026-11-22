# Yapster - Real-Time Squad & Community Chat Platform 🗣️⚡

> "Less waiting, more yapping." A modern, real-time messaging workspace built for squads, campus circles, and dev teams.

---

## 1. Problem Statement
Group communication for project teams and student circles is often scattered across clunky platforms. WhatsApp lacks channel-based organization and thread context, while enterprise tools like Slack are bloated, rigid, and uninspiring for student squads. **Yapster** solves this by providing a snappy, Gen-Z styled real-time chat application featuring organized topic channels ("Yap Rooms"), instant WebSocket messaging, clean authentication, and smooth user experience.

---

## 2. User Roles
- **Admin / Room Creator:** Can create public or private Yap Rooms, manage room details (topic/title), moderate participants, and delete rooms.
- **Member / Yapper:** Can register and securely log in, discover and join rooms, exchange real-time messages, view live typing indicators, and access persistent chat history.

---

## 3. Feature Scope

### 🚀 MVP Features (Must-Haves for Days 1–15):
1. **User Authentication:** Secure sign-up and login using password hashing (bcrypt) and JWT (JSON Web Token) authentication.
2. **Protected Routes & Middleware:** Route guards ensuring only authenticated users can access rooms and dispatch messages.
3. **Yap Rooms Management (CRUD):** Complete Create, Read, Update, and Delete operations for chat channels/rooms.
4. **Room Discovery & Search:** Search bar to filter rooms by tags or names, with pagination support for scalability.
5. **Message Persistence:** Reliable database storage connecting messages to rooms, authors, and timestamps.
6. **Chat History & Infinite Scroll:** Chronological retrieval of past messages with cursor/offset pagination.
7. **Responsive Modern UI:** Gen-Z dark-mode aesthetic layout with a room directory sidebar and active chat feed.
8. **Real-Time Messaging (Heavy Feature):** Low-latency, bidirectional real-time chat via WebSockets (Socket.io) with instant UI updates.
9. **Live Squad Indicators:** Real-time user typing status ("Alex is yapping...") and active online presence indicator.
10. **Error States & Loading Indicators:** Intuitive error alerts, skeleton loaders, and graceful reconnection handling.

### 🔮 Post-MVP Features (Later Enhancements):
- Direct 1-on-1 private messaging (DMs)
- Media, meme, and file attachments
- Audio/Voice huddle rooms (WebRTC)
- Emoji message reactions
