import { ModalProps } from '@/components/ui/modal';
import React from 'react';

export const callModalTemplate = (
  name: string,
  status: 'success' | 'error' | 'exists',
  action: string,
  setModalProps: React.Dispatch<React.SetStateAction<ModalProps | null>>
): ModalProps => {
  if (status === 'exists') {
    return {
      title: 'Error',
      message: `${name} already exists.`,
      type: 'error',
      onCancel: () => setModalProps(null)
    };
  } else {
    return {
      title: status === 'success' ? 'Success' : 'Error',
      message:
        status === 'success'
          ? `${name} has been succesfully ${action}ed!`
          : `Failed to ${action} ${name}. Please try again.`,
      type: status,
      onCancel: () => setModalProps(null)
    };
  }
};
