'use client';

import { useEffect, useState } from 'react';
import emailjs from '@emailjs/browser';

export default function ContactForm() {
  const [errorEmail, setErrorEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [messageInfo, setMessageInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });

  const updateMessageInfo = (field: string, value: string) => {
    setMessageInfo((messageInfo) => ({
      ...messageInfo,
      [field]: value
    }));
  };

  useEffect(() => {
    const regexEmailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (messageInfo.email.length > 7 && !regexEmailPattern.test(messageInfo.email)) {
      setErrorEmail('Error: Please enter a valid email.');
    } else {
      setErrorEmail('');
    }
  }, [messageInfo.email, setErrorEmail]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !messageInfo.firstName ||
      !messageInfo.lastName ||
      !messageInfo.email ||
      !messageInfo.message
    ) {
      setErrorMessage('All fields are required.');
      setSuccessMessage('');
      return;
    }

    // EmailJS parameters
    const templateParams = {
      first_name: messageInfo.firstName,
      last_name: messageInfo.lastName,
      email: messageInfo.email,
      message: messageInfo.message
    };

    emailjs
      .send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_USER_ID!
      )
      .then(
        (response) => {
          setSuccessMessage('Message sent successfully!');
          setErrorMessage('');

          updateMessageInfo('firstName', '');
          updateMessageInfo('lastName', '');
          updateMessageInfo('email', '');
          updateMessageInfo('message', '');
        },
        (error) => {
          setErrorMessage('Failed to send message. Please try again.');
          setSuccessMessage('');
          console.error('EmailJS error:', error);
        }
      );
  };
  return (
    <div className="flex h-full flex-col justify-center gap-8 px-8 py-16 shadow-lg md:rounded-l-lg md:p-8 dark:lg:bg-neutral-900">
      <header className="flex flex-col gap-4">
        <h2 className="text-xl uppercase md:text-4xl">Contact Us</h2>
        <p className="text-sm md:text-base">
          Have questions or need assistance? We're here to help! Feel free to send us a message
          through this form.
        </p>
      </header>
      {/* Form */}
      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6 xl:flex-row">
          <div className="flex flex-1 flex-col gap-2 text-left">
            <label htmlFor="firstName" className="text-xs">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              placeholder="Juan"
              className="ease rounded-md p-3 text-sm transition-colors duration-200 focus:border-chili focus:ring-chili dark:text-background focus:dark:border-neutral-300 focus:dark:ring-neutral-100"
              autoComplete="given-name"
              value={messageInfo.firstName}
              onChange={(e) => updateMessageInfo('firstName', e.target.value)}
            />
          </div>

          <div className="flex flex-1 flex-col gap-2 text-left">
            <label htmlFor="lastName" className="text-xs">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              placeholder="Dela Cruz"
              className="ease rounded-md p-3 text-sm transition-colors duration-200 focus:border-chili focus:ring-chili dark:text-background focus:dark:border-neutral-300 focus:dark:ring-neutral-100"
              autoComplete="family-name"
              value={messageInfo.lastName}
              onChange={(e) => updateMessageInfo('lastName', e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 text-left">
          <label htmlFor="email" className="text-xs">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="example@gmail.com"
            className="ease rounded-md p-3 text-sm transition-colors duration-200 focus:border-chili focus:ring-chili dark:text-background focus:dark:border-neutral-300 focus:dark:ring-neutral-100"
            autoComplete="email"
            value={messageInfo.email}
            onChange={(e) => updateMessageInfo('email', e.target.value)}
          />
          {errorEmail && <p className="text-xs text-red-500">{errorEmail}</p>}
        </div>

        <div className="flex flex-col gap-2 text-left">
          <label htmlFor="message" className="text-xs">
            Message
          </label>
          <textarea
            rows={6}
            id="message"
            name="message"
            placeholder="Hello! I am writing about.."
            className="resize-none rounded-md p-4 text-sm transition-all duration-200 ease-linear focus:border-chili focus:ring-chili dark:text-background focus:dark:border-neutral-300 focus:dark:ring-neutral-100"
            value={messageInfo.message}
            onChange={(e) => updateMessageInfo('message', e.target.value)}
          />
        </div>

        <div className="flex w-full justify-end">
          <button
            type="submit"
            className="text-md w-full rounded-md bg-pale py-2 text-lg font-bold text-neutral-200 duration-200 ease-linear hover:bg-chili"
          >
            Submit
          </button>
        </div>
      </form>

      {/* Success/Error Messages */}
      {successMessage && <p className="text-xs text-green-500">{successMessage}</p>}
      {errorMessage && <p className="text-xs text-red-500">{errorMessage}</p>}
    </div>
  );
}
