
import React from 'react';
import { EMERGENCY_CONTACTS } from '../constants';

export const EmergencyContacts: React.FC = () => {
  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
      <h3 className="text-lg font-semibold text-gray-300 mb-4">Emergency Contacts</h3>
      <ul className="space-y-3">
        {EMERGENCY_CONTACTS.map((contact, index) => (
          <li key={index} className="flex justify-between items-center bg-gray-700/50 p-3 rounded-md">
            <div>
              <p className="font-semibold text-white">{contact.name}</p>
              <p className="text-sm text-gray-400">{contact.relation}</p>
            </div>
            <a href={`tel:${contact.phone}`} className="text-sm text-brand-green hover:underline">
              {contact.phone}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
