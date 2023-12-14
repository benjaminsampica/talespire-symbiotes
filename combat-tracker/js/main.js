import encounterStateService from './encounterStateService.js';
import invalidStateService from './invalidStateService.js';
import symbioteStateService from './symbioteStateService.js';

window.startTrackingAsync = encounterStateService.startTrackingAsync;
window.handleInitiativeEvents = encounterStateService.handleInitiativeEvents;
window.onStateChangeEventAsync = symbioteStateService.onStateChangeEventAsync;

addEventListener("error", (event) => {
    invalidStateService.setInvalidState(`We're sorry, something went wrong. Please report it and we'll make sure to fix it. Error: ${event.message}`);
});
