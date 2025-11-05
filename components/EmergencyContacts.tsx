
import React from 'react';
import { EmergencyContact } from '../types';

interface EmergencyContactsProps {
  contacts: EmergencyContact[];
  isSharingLocation: boolean;
  onToggleShare: () => void;
  isMonitoring: boolean;
}

const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-accent" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>;

const EmergencyContacts: React.FC<EmergencyContactsProps> = ({ contacts, isSharingLocation, onToggleShare, isMonitoring }) => {
  return (
    <div className="bg-brand-secondary p-6 rounded-2xl shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-300">Emergency Contacts</h3>
        <div className="flex items-center space-x-2">
            <span className={`text-xs font-medium transition-colors ${isMonitoring && isSharingLocation ? 'text-brand-accent' : 'text-gray-400'}`}>
                Share Live Location
            </span>
            <label htmlFor="location-share-toggle" className={`relative inline-flex items-center ${isMonitoring ? 'cursor-pointer' : 'cursor-not-allowed'}`}>
                <input 
                    type="checkbox" 
                    id="location-share-toggle" 
                    className="sr-only peer"
                    checked={isSharingLocation}
                    onChange={onToggleShare}
                    disabled={!isMonitoring}
                />
                <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-accent peer-disabled:opacity-50"></div>
            </label>
        </div>
      </div>
      <ul className="space-y-4">
        {contacts.map(contact => (
          <li key={contact.id} className="flex items-center p-3 bg-gray-700/50 rounded-lg">
            <UserIcon />
            <div className="ml-4 flex-grow">
              <p className="font-semibold text-white">{contact.name}</p>
              <p className="text-sm text-gray-400">{contact.relation} - {contact.phone}</p>
            </div>
            {isMonitoring && isSharingLocation && (
                <div className="flex items-center space-x-1.5 bg-brand-accent/20 text-brand-accent text-xs font-bold px-2 py-1 rounded-full">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-accent"></span>
                </span>
                <span>LIVE</span>
                </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmergencyContacts;