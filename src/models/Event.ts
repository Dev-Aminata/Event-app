export interface IEvent {
    id: string;
    title: string;
    description: string;
    date: Date;
    location: string;
    category: 'conference' | 'sport' | 'workshop' | 'other';
    maxCapacity: number;
}

export class Event implements IEvent {
    id: string;
    title: string;
    description: string;
    date: Date;
    location: string;
    category: 'conference' | 'sport' | 'workshop' | 'other';
    maxCapacity: number;

    constructor(
        title: string,
        description: string,
        date: Date | string,
        location: string,
        category: 'conference' | 'sport' | 'workshop' | 'other',
        maxCapacity: number
    ) {
        this.id = Date.now().toString(36) + Math.random().toString(36).substr(2);
        this.title = title;
        this.description = description;
        this.date = typeof date === 'string' ? new Date(date) : date;
        this.location = location;
        this.category = category;
        this.maxCapacity = maxCapacity;
    }
}
