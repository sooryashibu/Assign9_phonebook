document.addEventListener('DOMContentLoaded', () => {
  const apiUrl = 'https://68206bdd259dad2655ac7f51.mockapi.io/learnapisoorya/contacts'; // Replace with your actual API URL
  const contactForm = document.getElementById('contactForm');
  const nameInput = document.getElementById('name');
  const phoneInput = document.getElementById('phone');
  const contactsList = document.getElementById('contactsList');
  const searchInput = document.getElementById('search');
  let allContacts = [];
  let isEditMode = false;
  let editingContactId = null;

  // Fetch contacts and display them
  const fetchContacts = async () => {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      allContacts = data;
      displayContacts(data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  // Display contacts in the list with edit and delete buttons
  const displayContacts = (contacts) => {
    contactsList.innerHTML = ''; // Clear the list before displaying
    contacts.forEach((contact) => {
      const li = document.createElement('li');

      // Create contact info span
      const contactInfo = document.createElement('span');
      contactInfo.className = 'contact-info';
      contactInfo.textContent = `${contact.name} - ${contact.phone}`;

      // Create button group div
      const buttonGroup = document.createElement('div');
      buttonGroup.className = 'button-group';

      // Create Edit button
      const editButton = document.createElement('button');
      editButton.textContent = 'Edit';
      editButton.addEventListener('click', () => editContact(contact));

      // Create Delete button
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.addEventListener('click', () => deleteContact(contact.id));

      // Append buttons to the button group
      buttonGroup.appendChild(editButton);
      buttonGroup.appendChild(deleteButton);

      // Append elements to list item
      li.appendChild(contactInfo);
      li.appendChild(buttonGroup);

      contactsList.appendChild(li);
    });
  };

  // Add a new contact
  const addContact = async (name, phone) => {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, phone }),
      });
      const data = await response.json();
      console.log('Contact added:', data);
      fetchContacts(); // Refresh the contact list
    } catch (error) {
      console.error('Error adding contact:', error);
    }
  };

  // Edit a contact
  const editContact = (contact) => {
    nameInput.value = contact.name;
    phoneInput.value = contact.phone;

    // Set edit mode and store the contact ID
    isEditMode = true;
    editingContactId = contact.id;

    // Change the submit button to an "Update" button
    const submitButton = contactForm.querySelector('button');
    submitButton.textContent = 'Update Contact';

    contactForm.removeEventListener('submit', handleAddContact); // Remove existing listener
    contactForm.addEventListener('submit', (e) => handleUpdateContact(e)); // Add new listener for updating
  };

  // Handle add contact
  const handleAddContact = async (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();

    if (!name || !phone) {
      alert('Both name and phone number are required.');
      return;
    }

    await addContact(name, phone); // Add the new contact
    nameInput.value = '';
    phoneInput.value = '';
  };

  // Handle update contact
  const handleUpdateContact = async (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();

    if (!name || !phone) {
      alert('Both name and phone number are required.');
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/${editingContactId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, phone }),
      });
      const updatedContact = await response.json();
      console.log('Contact updated:', updatedContact);
      fetchContacts(); // Refresh the contact list
    } catch (error) {
      console.error('Error updating contact:', error);
    }

    // Reset the form to Add mode
    nameInput.value = '';
    phoneInput.value = '';
    const submitButton = contactForm.querySelector('button');
    submitButton.textContent = 'Add Contact';

    isEditMode = false;
    editingContactId = null;
    contactForm.removeEventListener('submit', handleUpdateContact); // Remove update listener
    contactForm.addEventListener('submit', handleAddContact); // Add listener for adding
  };

  // Delete a contact
  const deleteContact = async (contactId) => {
    const confirmDelete = confirm('Are you sure you want to delete this contact?');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${apiUrl}/${contactId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        console.log('Contact deleted');
        fetchContacts(); // Refresh the contact list
      } else {
        console.error('Error deleting contact');
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    console.log('Searching for:', searchTerm);  // Debugging line
  
    // Filter contacts from the allContacts array (no need to fetch again)
    const filteredContacts = allContacts.filter((contact) => {
      // Check if contact.name and contact.phone are defined
      const name = contact.name ? contact.name.toLowerCase() : '';
      const phone = contact.phone ? contact.phone : '';
  
      return name.includes(searchTerm) || phone.includes(searchTerm);
    });
  
    console.log('Filtered Contacts:', filteredContacts);  // Debugging line
  
    displayContacts(filteredContacts); // Display filtered contacts
  });
  // Initial fetch to load all contacts
  contactForm.addEventListener('submit', handleAddContact);
  fetchContacts();
});
