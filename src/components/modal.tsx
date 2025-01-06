'use client';

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

export type ModalProps = {
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  onCancel?: () => void;
  onConfirm?: () => void;
  children?: ReactNode;
};

export default function Modal({
  title,
  message,
  type,
  onCancel,
  onConfirm,
  children
}: ModalProps) {
  const modalStyles = {
    info: {
      borderColor: 'border-neutral-500',
      textColor: 'text-neutral-500',
      icon: '🤖'
    },
    success: {
      borderColor: 'border-green-500',
      textColor: 'text-green-500',
      icon: '✅'
    },
    warning: {
      borderColor: 'border-yellow-500',
      textColor: 'text-yellow-500',
      icon: '⚠️'
    },
    error: {
      borderColor: 'border-red-500',
      textColor: 'text-red-500',
      icon: '❌'
    }
  };

  const currentStyle = modalStyles[type] || modalStyles.info;

  return (
    <aside className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
      {/* Wrapper */}
      <motion.div
        className={`z-50 ml-20 flex w-80 max-w-lg flex-col border-2 bg-neutral-800 p-4 md:ml-0 md:w-full ${currentStyle.borderColor} rounded-md shadow-lg`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        {/* Header */}
        <div className={`flex items-center p-4 ${currentStyle.textColor}`}>
          <span className="text-2xl">{currentStyle.icon}</span>
          <h1 className="ml-2 text-xl font-semibold">{title}</h1>
        </div>
        {/* End of Header */}

        {/* Body */}
        <div className="p-4 text-neutral-400">
          {message && <p>{message}</p>}
          {children && <div>{children}</div>}
        </div>
        {/* End of Body */}

        {/* Footer Buttons */}
        <div className="flex justify-between gap-4 px-4 py-1 text-sm">
          {(type === 'info' || type === 'warning') && (
            <>
              <button
                className="rounded-md border border-red-700 bg-red-900 px-4 text-neutral-200 hover:border-red-600 hover:bg-red-800"
                onClick={onCancel}
              >
                Cancel
              </button>
              <button
                className={`rounded-md border px-8 py-2 font-semibold text-white ${
                  type === 'warning'
                    ? 'bg-yellow-400 hover:bg-yellow-500'
                    : 'border-green-700 bg-green-900 hover:border-green-600 hover:bg-green-800'
                }`}
                onClick={onConfirm}
              >
                Go
              </button>
            </>
          )}
          {type === 'error' && (
            <button
              className="rounded-md bg-red-400 px-4 py-2 font-semibold text-white hover:bg-red-500"
              onClick={onCancel}
            >
              Dismiss
            </button>
          )}
        </div>
        {/* End of Footer Buttons */}
      </motion.div>
      {/* End of Wrapper */}
    </aside>
  );
}
