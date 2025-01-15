import { ModalProps } from '@/components/modal';
import React from 'react';

export const callModalTemplate = (
  name: string,
  status: 'success' | 'error',
  action: string,
  setModalProps: React.Dispatch<React.SetStateAction<ModalProps | null>>
): ModalProps => {
  return {
    title: status === 'success' ? 'Success' : 'Error',
    message:
      status === 'success'
        ? `${name} has been succesfully ${action}ed!`
        : `Failed to ${action} ${name}. Please try again.`,
    type: status,
    onCancel: () => setModalProps(null)
  };
};
