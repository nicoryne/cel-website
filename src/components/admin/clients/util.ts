import { ModalProps } from '@/components/modal';

const failedModal: ModalProps = {
  title: 'Error',
  message: 'Failed to add Schedule. Please try again.',
  type: 'error',
  onCancel: () => setModalProps(null)
};

export const successModal: ModalProps = {
  title: 'Success',
  message: 'Schedule has been successfully added!',
  type: 'success'
};

export const callSuccessModal = (val: string): ModalProps => {
  return {
    title: 'Success',
    message: 'Schedule has been successfully added!',
    type: 'success'
  };
};
