# Event Management Web Application

## 1. Project Presentation
❖ **Brief Application Description**: A comprehensive web application for creating, managing, and browsing events, as well as handling user registrations.
❖ **Functional Goals**: To provide an intuitive interface for event organizers and participants, demonstrating the power of TypeScript and Object-Oriented Programming without external frameworks.
❖ **Tech Used**: TypeScript, HTML, CSS (Vanilla).

## 2. Implemented Features
| Feature | Status |
| :--- | :--- |
| Create events | OK |
| Display full event list | OK |
| Filter events | OK |
| Event detail page | OK |
| User registration | OK |
| Duplicate registration protection | OK |
| Capacity control | OK |
| **Bonus**: Dark mode / Responsive | OK |

## 3. Project Structure
```
event-app/
│── index.html
│── styles/
│   └── main.css
│── dist/
│── src/
│   ├── models/
│   │   ├── Event.ts
│   │   ├── User.ts
│   │   ├── Registration.ts
│   │   └── EventManager.ts
│   └── main.ts
│── tsconfig.json
│── package.json
│── .gitignore
└── README.md
```

## 4. Installation & Execution
```bash
# Install dependencies
npm install

# Build the TypeScript code
npm run build

# Start the local development server
npm start
```
Alternatively, you can open `index.html` directly in your browser, but a local server (Steps above) is recommended for best experience.

## 5. How to Use the Application
1. **Create an Event**: Navigate to the "Create Event" section, fill in the details (Title, Description, Date, ...), and click "Create Event".
2. **Filter/Search**: Use the dropdown menus above the event list to filter by Category or sort by Date.
3. **Event Details**: Click on an event card to view full details in a modal/dedicated view.
4. **Register**: On the event detail view, enter your Name and Email to register.
5. **Capacity/Validation**: The system will prevent registration if the event is full or if the email is already registered for that specific event.

## 6. Screenshots
*(Screenshots to be added after implementation)*

## 7. Conclusion & Limitations
This project demonstrates the effective use of TypeScript's strict typing and OOP principles to manage complex state without a database. One limitation is that data is stored in-memory, so it resets upon page reload. Future improvements could include `localStorage` integration or a backend API.

## 8. Author Information
| Field | Value |
| :--- | :--- |
| Full Name | Oceanne Aminata |
| Email | aminata.oceane@saintjeaningenieur.org |
