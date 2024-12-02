import './index.css';
import { useState, useEffect } from 'react';
import contactService from './services/contacts';
// import axios from 'axios';

const Filter = ({ filterText, handleFilterChange }) => (
  <div>
    <label htmlFor="filter">filter shown with </label>
    <input id="filter" value={filterText} onChange={handleFilterChange} />
  </div>
);

const NewContact = ({
  addContact,
  nameInput,
  handleNameChange,
  numberInput,
  handleNumberChange,
}) => (
  <form className="form" onSubmit={addContact}>
    <div>
      <label htmlFor="name">name </label>
      <input id="name" value={nameInput} onChange={handleNameChange} />
    </div>
    <div>
      <label htmlFor="number">number </label>
      <input id="number" value={numberInput} onChange={handleNumberChange} />
    </div>
    <button type="submit">save</button>
  </form>
);

const ContactList = ({ filteredContacts, handleDelete }) => (
  <div className="contactList">
    {filteredContacts.map((contact) => (
      <p className="contact" key={contact.id}>
        {contact.name} {contact.number}{' '}
        <button onClick={() => handleDelete(contact.id, contact.name)}>
          delete
        </button>
      </p>
    ))}
  </div>
);

const NotificationMessage = ({ message, type }) => {
  if (message === null) {
    return null;
  }

  const messageClass =
    type === 'error' ? 'error-message' : 'notification-message';

  return <div className={messageClass}>{message}</div>;
};

const App = () => {
  const [contactList, setContactList] = useState([]);
  const [nameInput, setNameInput] = useState('');
  const [numberInput, setNumberInput] = useState('');
  const [filterText, setFilterText] = useState('');
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // ladataan data palvelimelta
  useEffect(() => {
    contactService.getAll().then((initialContacts) => {
      setContactList(initialContacts);
    });
  }, []);

  const addContact = (event) => {
    event.preventDefault();

    // tarkistetaan onko nimi jo kontaktilistalla
    const existingContact = contactList.find(
      (contact) =>
        contact.name &&
        typeof contact.name === 'string' &&
        contact.name.toLowerCase() === nameInput.toLowerCase()
    );

    if (existingContact) {
      // jos nimi on jo kontaktilistalla, kysytään haluaako käyttäjä päivittää numeron
      const confirmUpdate = window.confirm(
        `${nameInput} has already been added to the phonebook, do you want to update the number?`
      );

      if (confirmUpdate) {
        const updatedContact = { ...existingContact, number: numberInput };

        // päivitetään nimi put-methodilla
        contactService
          .update(existingContact.id, updatedContact)
          .then((returnedContact) => {
            setContactList(
              contactList.map((contact) =>
                contact.id !== existingContact.id ? contact : returnedContact
              )
            );
            setNameInput('');
            setNumberInput('');
            setNotificationMessage(`updated ${nameInput}'s number`);
            setTimeout(() => {
              setNotificationMessage(null);
            }, 5000);
          })
          // jos nimi jo poistettu kontaktilistalta error 404
          .catch((error) => {
            if (error.response && error.response.status === 404) {
              setErrorMessage(`${nameInput} has already been deleted`);
              setTimeout(() => {
                setErrorMessage(null);
              }, 5000);
            } else {
              setErrorMessage('error updating contact');
              setTimeout(() => {
                setErrorMessage(null);
              }, 5000);
            }
          });
      } else {
        setNameInput('');
        setNumberInput('');
      }
    } else {
      // jos nimeä ei ole vielä kontaktilistalla, luodaan uusi kontakti post-methodilla
      const newContact = { name: nameInput, number: numberInput };

      contactService
        .create(newContact)
        .then((returnedContact) => {
          setContactList(contactList.concat(returnedContact));
          setNotificationMessage(
            `${newContact.name} has been added to the phonebook`
          );
          setTimeout(() => {
            setNotificationMessage(null);
          }, 5000);
          setNameInput('');
          setNumberInput('');
        })
        .catch((error) => {
          setErrorMessage('error adding contact');
          setTimeout(() => {
            setErrorMessage(null);
          }, 5000);
        });
    }
  };

  const deleteContact = (id, name) => {
    const confirmDelete = window.confirm(`delete ${name}?`);
    // poistetaan nimi delete-methodilla
    if (confirmDelete) {
      contactService
        .remove(id)
        .then(() => {
          setContactList(contactList.filter((contact) => contact.id !== id));
          setNotificationMessage(`${name} has been deleted from the phonebook`);
          setTimeout(() => {
            setNotificationMessage(null);
          }, 5000);
        })
        // jos nimi jo poistettu kontaktilistalta error 404
        .catch((error) => {
          if (error.response && error.response.status === 404) {
            setErrorMessage(`${name} has already been deleted`);
            setTimeout(() => {
              setErrorMessage(null);
            }, 5000);
          } else {
            setErrorMessage('error updating contact');
            setTimeout(() => {
              setErrorMessage(null);
            }, 5000);
          }
        });
    }
  };

  const filteredContacts = contactList.filter(
    (contact) =>
      contact.name &&
      typeof contact.name === 'string' &&
      contact.name.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div>
      <h1>phonebook</h1>
      <NotificationMessage message={notificationMessage} type="success" />
      <NotificationMessage message={errorMessage} type="error" />

      <Filter
        filterText={filterText}
        handleFilterChange={(e) => setFilterText(e.target.value)}
      />

      <h2>add a new contact</h2>
      <NewContact
        addContact={addContact}
        nameInput={nameInput}
        handleNameChange={(e) => setNameInput(e.target.value)}
        numberInput={numberInput}
        handleNumberChange={(e) => setNumberInput(e.target.value)}
      />

      <h2>contacts</h2>
      <ContactList
        filteredContacts={filteredContacts}
        handleDelete={deleteContact}
      />
    </div>
  );
};

export default App;
