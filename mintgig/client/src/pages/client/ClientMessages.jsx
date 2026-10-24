import React from 'react';
import StudentMessages from '../student/StudentMessages';

// Both roles share the unified real-time conversation interface
export const ClientMessages = () => {
  return <StudentMessages />;
};

export default ClientMessages;
