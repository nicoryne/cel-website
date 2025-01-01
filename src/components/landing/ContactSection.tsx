'use client';

import React from 'react';
import emailjs from '@emailjs/browser';

export default function ContactSection() {
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [errorEmail, setErrorEmail] = React.useState('');
  const [successMessage, setSuccessMessage] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');

  React.useEffect(() => {
    const regexEmailPattern =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (email.length > 7 && !regexEmailPattern.test(email)) {
      setErrorEmail('Error: Please enter a valid email.');
    } else {
      setErrorEmail('');
    }
  }, [email, setErrorEmail]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !message) {
      setErrorMessage('All fields are required.');
      setSuccessMessage('');
      return;
    }

    // EmailJS parameters
    const templateParams = {
      first_name: firstName,
      last_name: lastName,
      email,
      message
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

          setFirstName('');
          setLastName('');
          setEmail('');
          setMessage('');
        },
        (error) => {
          setErrorMessage('Failed to send message. Please try again.');
          setSuccessMessage('');
          console.error('EmailJS error:', error);
        }
      );
  };

  return (
    <section
      aria-labelledby="contact-heading"
      id="contact"
      className="bg-[var(--background)]"
    >
      <div className="flex w-fit flex-col gap-4">
        {/* Header */}
        <header className="text-left">
          <h2
            id="contact-heading"
            className="text-lg font-bold text-neutral-200"
          >
            Contact Us
          </h2>
          <p className="text-xs font-light text-neutral-300">
            Have any burning questions? Feel free to contact us through our
            email.
          </p>
        </header>

        {/* Form */}
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div className="flex flex-col justify-between gap-6 md:flex-row">
            <div className="flex flex-col gap-2 text-left">
              <label htmlFor="firstName" className="text-xs">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                placeholder="Juan"
                className="text-xs text-neutral-800"
                autoComplete="given-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2 text-left">
              <label htmlFor="lastName" className="text-xs">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                placeholder="Dela Cruz"
                className="text-xs text-neutral-800"
                autoComplete="family-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
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
              className="text-xs text-neutral-800"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errorEmail && <p className="text-xs text-red-500">{errorEmail}</p>}
          </div>

          <div className="flex flex-col gap-2 text-left">
            <label htmlFor="message" className="text-xs">
              Message
            </label>
            <textarea
              rows={4}
              id="message"
              name="message"
              placeholder="Hello! I am writing about.."
              className="text-xs text-neutral-800"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <div className="w-full">
            <button
              type="submit"
              className="w-full bg-[var(--cel-red)] py-1 text-neutral-200 duration-200 ease-linear hover:bg-red-600"
            >
              Submit
            </button>
          </div>
        </form>

        {/* Success/Error Messages */}
        {successMessage && (
          <p className="text-xs text-green-500">{successMessage}</p>
        )}
        {errorMessage && <p className="text-xs text-red-500">{errorMessage}</p>}
      </div>
    </section>
  );
}
