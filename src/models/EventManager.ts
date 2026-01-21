import { Event } from './Event.js';
import { User } from './User.js';
import { Registration } from './Registration.js';

export class EventManager {
    private events: Event[] = [];
    private users: User[] = [];
    private registrations: Registration[] = [];

    // --- Singleton Pattern (Optional but good for global state) ---
    private static instance: EventManager;
    private constructor() { }
    static getInstance(): EventManager {
        if (!EventManager.instance) {
            EventManager.instance = new EventManager();
        }
        return EventManager.instance;
    }

    // --- Event Management ---
    addEvent(event: Event): void {
        this.events.push(event);
    }

    getEvents(filter?: { category?: string; date?: string }): Event[] {
        let filtered = this.events;

        if (filter?.category) {
            filtered = filtered.filter(e => e.category === filter.category);
        }

        // Simple date filtering (exact match or future/past logic could be added)
        // Here we can assume exact match for simplicity or just sorting
        // Let's implement sorting by date by default if no specific date filter logic is strictly requested
        return filtered.sort((a, b) => a.date.getTime() - b.date.getTime());
    }

    getEventById(id: string): Event | undefined {
        return this.events.find(e => e.id === id);
    }

    // --- User & Registration ---

    registerUser(fullName: string, email: string, eventId: string): { success: boolean; message: string } {
        const event = this.getEventById(eventId);

        if (!event) {
            return { success: false, message: "Event not found." };
        }

        // Check 1: Event Date Passed
        if (new Date() > event.date) {
            return { success: false, message: "Registration closed. Event has already passed." };
        }

        // Check 2: Capacity
        const eventRegistrations = this.registrations.filter(r => r.event.id === eventId);
        if (eventRegistrations.length >= event.maxCapacity) {
            return { success: false, message: "Event is full." };
        }

        // Check 3: Duplicate Registration (by email)
        const isAlreadyRegistered = eventRegistrations.some(r => r.user.email === email);
        if (isAlreadyRegistered) {
            return { success: false, message: "User with this email is already registered for this event." };
        }

        // Create User (or find existing - simplified to create new for now as per requirements implying simple lists)
        // We can check if user exists globally to reuse ID, but requirements say "User list"
        let user = this.users.find(u => u.email === email);
        if (!user) {
            user = new User(fullName, email);
            this.users.push(user);
        }

        const registration = new Registration(event, user);
        this.registrations.push(registration);

        return { success: true, message: "Registration successful!" };
    }

    getRegistrationsForEvent(eventId: string): Registration[] {
        return this.registrations.filter(r => r.event.id === eventId);
    }
}
