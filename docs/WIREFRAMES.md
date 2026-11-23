# Yapster - Screen Wireframes (UI Layouts) 📱💻

This document outlines the 4 core screens required for **Yapster**:
1. **Screen 1:** Auth Screen (Login / Signup)
2. **Screen 2:** Main Room Directory Screen (Rooms List & Search)
3. **Screen 3:** Active Chat Screen (Detail View & Live Messaging Feed)
4. **Screen 4:** Room Settings / Admin Dashboard Screen

---

## Screen 1: Auth Screen (Login & Signup)

```
+-------------------------------------------------------------+
|                                                             |
|                         ⚡ YAPSTER                          |
|                  "Less waiting, more yapping"               |
|                                                             |
|           +---------------------------------------+         |
|           |            [ Login ] | [ Sign Up ]    |         |
|           |---------------------------------------|         |
|           | Email                                 |         |
|           | [ user@college.edu                  ] |         |
|           |                                       |         |
|           | Password                              |         |
|           | [ ******************                ] |         |
|           |                                       |         |
|           | [      Let's Yap (Submit)           ] |         |
|           |                                       |         |
|           | New to Yapster? Create an account     |         |
|           +---------------------------------------+         |
|                                                             |
+-------------------------------------------------------------+
```

---

## Screen 2: Main Rooms Directory (Discovery & Search)

```
+-------------------------------------------------------------------------------+
| ⚡ Yapster | [ Search rooms: e.g. "code"... ]         | (Online) @jainil [Log]|
+-------------------+-----------------------------------------------------------+
| [+ Create Room]   | Discover Squad Rooms                                      |
|                   |                                                           |
| FAVORITE ROOMS    | +-------------------------------------------------------+ |
| # general         | | # dev-squad                           (14 members)   | |
| # coders          | | For hackathons, React, Node.js and bugs               | |
|                   | | [ Join Room ]                                         | |
| ALL ROOMS         | +-------------------------------------------------------+ |
| # placement-2026  | | # campus-memes                        (42 members)   | |
| # project-hub     | | Only high quality memes and banter                    | |
| # study-room      | | [ Join Room ]                                         | |
|                   | +-------------------------------------------------------+ |
|                   |                                                           |
|                   | < Prev [ Page 1 of 4 ] Next >                             |
+-------------------+-----------------------------------------------------------+
```

---

## Screen 3: Active Chat Feed (Detail Screen - Real-Time)

```
+-------------------------------------------------------------------------------+
| ⚡ Yapster        | # dev-squad  | 🟢 8 online             | [ Room Settings ]|
+-------------------+-----------------------------------------------------------+
| CHANNELS          | 📅 Today                                                  |
| > # dev-squad     |                                                           |
|   # general       | [Avatar] Alex (12:30 PM):                                 |
|   # study-room    | Hey squad! Did you test the Socket.io connection?        |
|                   |                                                           |
| ONLINE SQUAD (3)  | [Avatar] Jainil (12:32 PM):                               |
| 🟢 Alex           | Yes, latency is under 30ms. Ready for deployment!         |
| 🟢 Jainil (You)   |                                                           |
| 🟡 Dev            | 💬 Alex is yapping... (Typing indicator)                 |
|                   |-----------------------------------------------------------|
|                   | [ Type your message in #dev-squad...            ] [Send >]|
+-------------------+-----------------------------------------------------------+
```

---

## Screen 4: Room Settings & Admin Dashboard

```
+-------------------------------------------------------------------------------+
| ⚡ Yapster > Settings > # dev-squad                                           |
+-------------------------------------------------------------------------------+
|                                                                               |
|   Room Name:        [ dev-squad                             ]                 |
|   Room Topic:       [ Discussion on hackathon, bugs, and PRs]                 |
|   Privacy:          ( ) Public   (*) Squad Only                               |
|                                                                               |
|   MEMBERS (3)                                                                 |
|   +-------------------------------------------------------------------------+ |
|   | Jainil (Creator / Admin)                       [ Can't Remove ]         | |
|   | Alex (Member)                                  [ Remove ] [ Make Admin] | |
|   | Dev (Member)                                   [ Remove ] [ Make Admin] | |
|   +-------------------------------------------------------------------------+ |
|                                                                               |
|   [ Save Changes ]                [ ⚠️ Delete Room (Danger Zone) ]           |
|                                                                               |
+-------------------------------------------------------------------------------+
```
