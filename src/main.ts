import { Event } from './models/Event.js';
import { EventManager } from './models/EventManager.js';
import { Registration } from './models/Registration.js';

// --- Initialization ---
const eventManager = EventManager.getInstance();

// --- DOM Elements ---
// Navigation
const btnShowEvents = document.getElementById('btn-show-events') as HTMLButtonElement;
const btnCreateEventView = document.getElementById('btn-create-event-view') as HTMLButtonElement;
const sectionEventList = document.getElementById('event-list-section') as HTMLElement;
const sectionCreateEvent = document.getElementById('create-event-section') as HTMLElement;

// Event Creation
const createEventForm = document.getElementById('create-event-form') as HTMLFormElement;
const btnCancelCreate = document.getElementById('btn-cancel-create') as HTMLButtonElement;

// Event List
const eventsGrid = document.getElementById('events-grid') as HTMLElement;
const noEventsMsg = document.getElementById('no-events-msg') as HTMLElement;
const filterCategory = document.getElementById('filter-category') as HTMLSelectElement;

// Modal
const modalOverlay = document.getElementById('event-modal') as HTMLElement;
const closeModalBtn = document.getElementById('close-modal') as HTMLButtonElement;
const detailCategory = document.getElementById('detail-category') as HTMLElement;
const detailTitle = document.getElementById('detail-title') as HTMLElement;
const detailDate = document.getElementById('detail-date') as HTMLElement;
const detailLocation = document.getElementById('detail-location') as HTMLElement;
const detailCapacity = document.getElementById('detail-capacity') as HTMLElement;
const detailDescription = document.getElementById('detail-description') as HTMLElement;

// Registration
const registrationForm = document.getElementById('registration-form') as HTMLFormElement;
const detailIdInput = document.getElementById('detail-id') as HTMLInputElement;
const regStatusMsg = document.getElementById('reg-status-msg') as HTMLElement;
const registrantsList = document.getElementById('registrants-display') as HTMLElement;

// --- Event Listeners ---

// Navigation Logic
btnShowEvents.addEventListener('click', () => {
    switchView('list');
});

btnCreateEventView.addEventListener('click', () => {
    switchView('create');
});

btnCancelCreate.addEventListener('click', () => {
    switchView('list');
});

// Create Event
createEventForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Check validation of native HTML5 first
    if (!createEventForm.checkValidity()) return;

    const title = (document.getElementById('event-title') as HTMLInputElement).value;
    const category = (document.getElementById('event-category') as HTMLSelectElement).value as any;
    const date = (document.getElementById('event-date') as HTMLInputElement).value;
    const location = (document.getElementById('event-location') as HTMLInputElement).value;
    const capacity = parseInt((document.getElementById('event-capacity') as HTMLInputElement).value);
    const description = (document.getElementById('event-description') as HTMLInputElement).value;

    const newEvent = new Event(title, description, date, location, category, capacity);
    eventManager.addEvent(newEvent);

    alert('Event created successfully!');
    createEventForm.reset();
    switchView('list');
});

// Filter
filterCategory.addEventListener('change', () => {
    renderEvents();
});

// Modal Close
closeModalBtn.addEventListener('click', () => {
    modalOverlay.classList.add('hidden');
});

// Registration
registrationForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const eventId = detailIdInput.value;
    const fullName = (document.getElementById('reg-fullname') as HTMLInputElement).value;
    const email = (document.getElementById('reg-email') as HTMLInputElement).value;

    const result = eventManager.registerUser(fullName, email, eventId);

    regStatusMsg.textContent = result.message;
    regStatusMsg.style.color = result.success ? 'var(--success-color)' : 'var(--error-color)';

    if (result.success) {
        registrationForm.reset();
        loadRegistrants(eventId);
        updateModalCapacity(eventId);
    }
});

// --- Functions ---

function switchView(view: 'list' | 'create') {
    if (view === 'list') {
        sectionEventList.classList.remove('hidden');
        sectionCreateEvent.classList.add('hidden');
        btnShowEvents.classList.add('active');
        btnCreateEventView.classList.remove('active');
        renderEvents();
    } else {
        sectionEventList.classList.add('hidden');
        sectionCreateEvent.classList.remove('hidden');
        btnShowEvents.classList.remove('active');
        btnCreateEventView.classList.add('active');
    }
}

function renderEvents() {
    const category = filterCategory.value;
    const events = eventManager.getEvents(category ? { category } : undefined);

    eventsGrid.innerHTML = '';

    if (events.length === 0) {
        noEventsMsg.classList.remove('hidden');
    } else {
        noEventsMsg.classList.add('hidden');
        events.forEach(event => {
            const card = createEventCard(event);
            eventsGrid.appendChild(card);
        });
    }
}

function createEventCard(event: Event): HTMLElement {
    const card = document.createElement('div');
    card.className = 'event-card';

    // Calculate capacity status
    const regs = eventManager.getRegistrationsForEvent(event.id);
    const isFull = regs.length >= event.maxCapacity;

    card.innerHTML = `
        <div class="card-image-placeholder">
            <i class="fa-solid ${getIconForCategory(event.category)}"></i>
        </div>
        <div class="card-content">
            <span class="badge">${event.category}</span>
            <h3 class="card-title">${event.title}</h3>
            <div class="card-info"><i class="fa-regular fa-calendar"></i> ${new Date(event.date).toLocaleDateString()}</div>
            <div class="card-info"><i class="fa-solid fa-location-dot"></i> ${event.location}</div>
            <div class="card-footer">
                <span class="capacity-indicator ${isFull ? 'full' : ''}">
                    ${isFull ? 'Full' : `${regs.length}/${event.maxCapacity} Spots`}
                </span>
                <button class="btn secondary">Details</button>
            </div>
        </div>
    `;

    card.addEventListener('click', () => {
        openModal(event);
    });

    return card;
}

function getIconForCategory(category: string): string {
    switch (category) {
        case 'conference': return 'fa-microphone-lines';
        case 'sport': return 'fa-basketball';
        case 'workshop': return 'fa-screwdriver-wrench';
        default: return 'fa-calendar-day';
    }
}

function openModal(event: Event) {
    detailIdInput.value = event.id;
    detailCategory.textContent = event.category;
    detailTitle.textContent = event.title;
    // Format date nicely
    detailDate.textContent = new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    detailLocation.textContent = event.location;
    detailDescription.textContent = event.description;

    regStatusMsg.textContent = '';
    registrationForm.reset();

    updateModalCapacity(event.id);
    loadRegistrants(event.id);

    modalOverlay.classList.remove('hidden');
}

function updateModalCapacity(eventId: string) {
    const event = eventManager.getEventById(eventId);
    if (event) {
        const regs = eventManager.getRegistrationsForEvent(eventId);
        detailCapacity.textContent = `${regs.length}/${event.maxCapacity}`;

        // Disable form if full
        const isFull = regs.length >= event.maxCapacity;
        const submitBtn = registrationForm.querySelector('button[type="submit"]') as HTMLButtonElement;

        if (isFull) {
            submitBtn.disabled = true;
            submitBtn.textContent = "Event Full";
            submitBtn.style.opacity = "0.5";
            submitBtn.style.cursor = "not-allowed";
        } else {
            // Check if date passed
            if (new Date() > new Date(event.date)) {
                submitBtn.disabled = true;
                submitBtn.textContent = "Event Ended";
                submitBtn.style.opacity = "0.5";
                submitBtn.style.cursor = "not-allowed";
            } else {
                submitBtn.disabled = false;
                submitBtn.textContent = "Confirm Registration";
                submitBtn.style.opacity = "1";
                submitBtn.style.cursor = "pointer";
            }
        }
    }
}

function loadRegistrants(eventId: string) {
    const regs = eventManager.getRegistrationsForEvent(eventId);
    registrantsList.innerHTML = '';

    if (regs.length === 0) {
        const li = document.createElement('li');
        li.textContent = "No registrations yet.";
        registrantsList.appendChild(li);
    } else {
        regs.forEach(r => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="fa-solid fa-user-check"></i> <strong>${r.user.fullName}</strong> (${r.user.email})`;
            registrantsList.appendChild(li);
        });
    }
}

// Initial render
renderEvents();
