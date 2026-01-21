export class User {
    id: string;
    fullName: string;
    email: string;

    constructor(fullName: string, email: string) {
        this.id = Date.now().toString(36) + Math.random().toString(36).substr(2);
        this.fullName = fullName;
        this.email = email;
    }
}
