import { Event } from './Event.js';
import { User } from './User.js';

export class Registration {
    id: string;
    event: Event;
    user: User;
    registrationDate: Date;

    constructor(event: Event, user: User) {
        this.id = Date.now().toString(36) + Math.random().toString(36).substr(2);
        this.event = event;
        this.user = user;
        this.registrationDate = new Date();
    }
}
