# Chat Application (Angular + Node.js)

## Table of Contents

- [Overview](#overview)
- [Git Repository Organization](#git-repository-organization)
- [Data Structures](#data-structures-used)
- [Angular Architecture](#angular-architecture)
- [Node Server Architecture (REST API)](#node-server-architecture-rest-api)
- [List of Server-Side Routes](#list-of-server-side-routes-rest-api)
- [Client-Server Interaction](#client-server-interaction)
- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
- [Contributing](#contributing)
- [License](#license)

## Overview

This is a real-time chat application built using Angular for the client-side and Node.js/Express.js with Socket.IO for the server-side. It features user authentication, group and channel management, and real-time messaging. The application is structured to handle roles such as Super Admin, Group Admin, and regular Users. Each role has specific permissions to manage users, groups, and channels.

---

## Git Repository Organization

- **Repository Structure:** The repository follows a well-structured format, where the client-side (Angular) and server-side (Node.js) code are kept in their respective folders.
  - Server-side files: `/Chat-server`
  - Frontend Angular app: `/src`
- **Branching:** A simple branching strategy with a single `main` branch was used for development. Bug fixes and enhancements were committed regularly.

- **Update Frequency:** The repository was frequently updated with each key feature committed as an independent task.

---

## Data Structures Used

### Client-Side (Angular)

- **Users:**
  ```typescript
  {
    id: number;
    username: string;
    password: string;
    roles: string[]; // ['Super Admin', 'Group Admin', 'User']
    groups: Group[];
  }
  ```
- **Groups:**

  ```typescript
  {
    id: number;
  name: string;
  userIds: number[]; // List of user IDs
  channels: Channel[];
  }
  ```

- **channels:**

  ```typescript
  {
    id: number;
    name: string;
  }
  ```

- **Notifications:**

  ```typescript
  {
    message: string;
    groupId: number;
    userId: number;
  }
  ```

### Server-Side (Node.js)

- **Users:** Stored in a JSON file (`users.json`). Each user has a unique id, username, password, roles, and associated groups.
- **Groups:** Managed in memory, with each group having a unique groupId, groupName, adminIds, and userIds.
- **Channels:** Managed in memory, where each channel is associated with a group and contains the list of user IDs that belong to it.

---

## Angular Architecture

### Components:

- **`login.component.ts`:** Handles user authentication (login and registration).
- **`dashboard.component.ts`:** Displays the groups and channels a user is part of and allows sending/receiving messages.
- **`group.component.ts`:** Manages group creation, channel creation, and user approvals within groups.
- **`superadmin.component.ts`:** Allows Super Admin to manage users, create groups, promote users to Group Admin, and manage channels.

### Services:

- **`auth.service.ts`:** Manages user login, registration, and user state.
- **`group.service.ts`:** Handles group and channel-related operations such as creating groups/channels, sending join requests, and loading notifications.
- **`chat.service.ts`:** Manages WebSocket communication for sending/receiving messages in real-time.

### Models:

- **User Model:**
  ```typescript
  {
    id: number;
    username: string;
    password: string;
    roles: string[]; // ['Super Admin', 'Group Admin', 'User']
    groups: Group[];
  }
  ```
- **Group Model:**

  ```typescript
  {
    id: number;
  name: string;
  userIds: number[]; // List of user IDs
  channels: Channel[];
  }
  ```

- **channel model:**

  ```typescript
  {
    id: number;
    name: string;
  }
  ```

- **Notifications Model:**

  ```typescript
  {
    message: string;
    groupId: number;
    userId: number;
  }
  ```

### Routes

- `/login`: Displays the login and registration page.
- `/dashboard`: Displays user-specific group and channel data.
- `/group`: Displays the group management interface for Group Admins.
- `/super-admin`: Displays the user management interface for Super Admins.

---

## Node Server Architecture (REST API)

### Modules:

- **express**: Manages HTTP requests and routes.
- **socket.io**: Manages real-time messaging functionality between clients and the server.
- **cors**: Allows cross-origin requests between the server and frontend.
- **body-parser**: Parses incoming request bodies in middleware.

### Functions:

- **User login and registration** (`/login`, `/user`).
- **User promotion and role updates** (`/user/promote`, `/user/upgrade`).
- **Group and channel creation** (`/group`, `/channel`).
- **Real-time messaging** with WebSocket (Socket.io).

### Files:

- **server.js**: Main entry point for the backend, handles routing and real-time communication.
- **users.json**: Contains all the user data, simulating a database for simplicity.

### Global Variables:

- **users**: Contains the list of all users, fetched from the JSON file.
- **groups**: Contains the list of all groups, managed in memory.
- **channels**: Contains the list of all channels, managed in memory.

## List of Server-Side Routes (REST API)

### POST `/login`

- **Parameters**: `username`, `password`.
- **Purpose**: Authenticate users and redirect them based on their roles.

### POST `/user`

- **Parameters**: `username`, `password`, `email`.
- **Purpose**: Register new users.

### POST `/user/promote`

- **Parameters**: `userId`.
- **Purpose**: Promote a user to Group Admin.

### POST `/user/upgrade`

- **Parameters**: `userId`.
- **Purpose**: Upgrade a user to Super Admin.

### POST `/group`

- **Parameters**: `groupName`, `adminId`.
- **Purpose**: Create a new group.

### DELETE `/user/:userId`

- **Parameters**: `userId`.
- **Purpose**: Remove a user from the system.

## Client-Server Interaction

### Login and Registration:

- Upon login, the client sends the `username` and `password` to the `/login` route. If successful, the authenticated user is stored locally in the browser.
- New users register via `/user`, which stores their information in the `users.json` file.

### Group and Channel Management:

- When a Group Admin creates a new group or channel, a request is sent to `/group` or `/channel`, and the server updates its in-memory list of groups or channels.
- These updates are reflected on the client side through Angular's **GroupService**, which re-fetches the latest data and updates the displayed lists in real-time.

### Messaging:

- The client subscribes to WebSocket events using **Socket.io**. When a message is sent, the server broadcasts the message to all clients connected to the same channel, and the message list on the client side is updated dynamically.

# Technologies Used

- **Client-Side**: Angular 18, TypeScript, HTML, CSS
- **Server-Side**: Node.js, Express.js, Socket.IO
- **Data Storage**: JSON files (for simplicity)

---

## Setup Instructions

### Prerequisites:

- Node.js and npm installed
- Angular CLI installed

### Steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/sapkotakristal1029/SFASSIGNTMENT.git

   ```

2. **Install server dependencies:**

   ```bash
        cd Chat-server
        npm install


   ```

3. **Install client dependencies:**

   ```bash
       cd src
       npm install

   ```

4. **Start server:**
   ```bash
        cd Chat-server
        node server.js
   ```
5. **Start client:**
   ```bash
        cd Chat-client
        ng serve
   ```
6. Navigate to http://localhost:4200 to access the application.

## Contributing

Contributions are welcome! Please create a pull request for any major changes.

---

## License

This project is open-source, which allows you to freely use, modify, and distribute the code.
