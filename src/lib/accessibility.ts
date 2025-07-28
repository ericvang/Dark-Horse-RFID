// Accessibility utilities for screen reader optimization

export const srOnly = "sr-only";
export const srOnlyFocusable = "sr-only focusable";

// ARIA live region types
export const ariaLiveTypes = {
  polite: "polite",
  assertive: "assertive",
  off: "off"
} as const;

// Common ARIA labels for reusable components
export const ariaLabels = {
  // Navigation
  sidebarToggle: "Toggle sidebar navigation",
  mainNavigation: "Main navigation",
  breadcrumbNavigation: "Breadcrumb navigation",
  
  // Actions
  save: "Save changes",
  cancel: "Cancel changes",
  delete: "Delete item",
  edit: "Edit item",
  view: "View details",
  close: "Close dialog",
  add: "Add new item",
  search: "Search items",
  filter: "Filter items",
  sort: "Sort items",
  
  // Status
  loading: "Loading content",
  error: "Error occurred",
  success: "Operation completed successfully",
  
  // Interactive elements
  checkbox: "Checkbox",
  radio: "Radio button",
  select: "Select option",
  input: "Input field",
  button: "Button",
  link: "Link",
  
  // Data
  table: "Data table",
  row: "Table row",
  cell: "Table cell",
  pagination: "Pagination navigation",
  
  // Modals and dialogs
  modal: "Modal dialog",
  dialog: "Dialog",
  overlay: "Modal overlay",
  
  // Charts and visualizations
  chart: "Chart visualization",
  dataPoint: "Data point",
  trend: "Trend indicator",
  
  // Forms
  form: "Form",
  fieldset: "Form section",
  required: "Required field",
  optional: "Optional field",
  
  // Notifications
  notification: "Notification",
  toast: "Toast notification",
  alert: "Alert message",
  
  // User interface
  menu: "Menu",
  dropdown: "Dropdown menu",
  tab: "Tab",
  tabPanel: "Tab panel",
  accordion: "Accordion section",
  collapsible: "Collapsible section",
  
  // Specific to our app
  itemCard: "Item card",
  itemGrid: "Items grid",
  statCard: "Statistics card",
  filterPanel: "Filter panel",
  sortOptions: "Sort options",
  bulkActions: "Bulk actions",
  dragHandle: "Drag handle for reordering",
  essentialIndicator: "Essential item indicator",
  statusIndicator: "Status indicator",
  categoryLabel: "Category label",
  lastSeenDate: "Last seen date",
  rfidTag: "RFID tag number"
} as const;

// ARIA descriptions for complex interactions
export const ariaDescriptions = {
  saveItem: "Saves the current item to the database",
  deleteItem: "Permanently removes this item from the system",
  editItem: "Opens the edit form for this item",
  viewItem: "Shows detailed information about this item",
  addItem: "Opens the form to create a new item",
  searchItems: "Search through all items by name, description, or category",
  filterItems: "Apply filters to narrow down the item list",
  sortItems: "Change the order of items in the list",
  bulkDelete: "Delete all selected items at once",
  dragReorder: "Drag to reorder items in the list",
  essentialToggle: "Mark or unmark this item as essential",
  statusChange: "Change the status of this item",
  categoryFilter: "Filter items by category",
  dateRangeFilter: "Filter items by last seen date range",
  pagination: "Navigate through pages of items",
  modalClose: "Close this dialog and return to the previous view",
  notificationDismiss: "Dismiss this notification",
  tabSwitch: "Switch to a different tab",
  accordionToggle: "Expand or collapse this section",
  dropdownSelect: "Select an option from the dropdown menu"
} as const;

// Screen reader announcements
export const announcements = {
  itemSaved: "Item saved successfully",
  itemDeleted: "Item deleted successfully",
  itemCreated: "New item created successfully",
  itemsFiltered: (count: number) => `${count} items found`,
  itemsSorted: (by: string) => `Items sorted by ${by}`,
  bulkDeleteComplete: (count: number) => `${count} items deleted`,
  dragComplete: "Items reordered successfully",
  filterCleared: "All filters cleared",
  presetLoaded: (name: string) => `Filter preset "${name}" loaded`,
  presetSaved: (name: string) => `Filter preset "${name}" saved`,
  pageChanged: (page: number) => `Page ${page} of results`,
  searchResults: (count: number) => `${count} search results found`,
  noResults: "No items match your search criteria",
  loadingStarted: "Loading content, please wait",
  loadingComplete: "Content loaded successfully",
  errorOccurred: "An error occurred, please try again",
  formValidationError: "Please correct the errors in the form",
  formSubmitted: "Form submitted successfully"
} as const;

// Utility functions
export const getAriaLabel = (key: keyof typeof ariaLabels, context?: string): string => {
  const baseLabel = ariaLabels[key];
  return context ? `${baseLabel} ${context}` : baseLabel;
};

export const getAriaDescription = (key: keyof typeof ariaDescriptions): string => {
  return ariaDescriptions[key];
};

export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite'): void => {
  // Create a live region for announcements
  let liveRegion = document.getElementById('sr-announcements');
  
  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.id = 'sr-announcements';
    liveRegion.setAttribute('aria-live', priority);
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = srOnly;
    document.body.appendChild(liveRegion);
  }
  
  // Update the content to trigger the announcement
  liveRegion.textContent = message;
  
  // Clear the message after a short delay
  setTimeout(() => {
    if (liveRegion) {
      liveRegion.textContent = '';
    }
  }, 1000);
};

// Focus management utilities
export const focusFirstInteractive = (container: HTMLElement): void => {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0] as HTMLElement;
  firstElement?.focus();
};

export const trapFocus = (container: HTMLElement): (e: KeyboardEvent) => void => {
  return (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      const focusableElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    }
  };
};

// Skip link utilities
export const createSkipLink = (targetId: string, text: string): HTMLAnchorElement => {
  const skipLink = document.createElement('a');
  skipLink.href = `#${targetId}`;
  skipLink.textContent = text;
  skipLink.className = srOnlyFocusable;
  skipLink.setAttribute('aria-label', `Skip to ${text.toLowerCase()}`);
  return skipLink;
}; 