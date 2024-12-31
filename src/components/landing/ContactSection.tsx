'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { EnvelopeIcon } from '@heroicons/react/20/solid';

export default function ContactSection() {
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [message, setMessage] = React.useState('');

  const [errorEmail, setErrorEmail] = React.useState('');

  // Email Validation
  React.useEffect(() => {
    // Checks if string has characters followed by '@', and then a '.'
    // with atleast 2 extra characters
    const regexEmailPattern =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Tests if email length is greater than 7, and against the regex pattern
    // if it matches
    if (email.length > 7 && !regexEmailPattern.test(email)) {
      setErrorEmail('Error: Please enter a valid email.');
    } else {
      setErrorEmail('');
    }
  }, [email, setErrorEmail]);

  return (
    <section
      aria-labelledby="contact-heading"
      id="contact"
      className="bg-[var(--background)]"
    >
      {/* Content Section */}
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
        {/* End of Header */}

        {/* Form */}
        <form className="flex flex-col gap-6">
          <div className="flex flex-col justify-between gap-6 md:flex-row">
            {/* First Name */}
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

            {/* Last Name */}
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

          {/* Email */}
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
          </div>

          {/* Message */}
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
              type="button"
              className="w-full bg-[var(--cel-red)] py-1 text-neutral-200 duration-200 ease-linear hover:bg-red-600"
            >
              Submit
            </button>
          </div>
        </form>
        {/* End of Form */}

        {/* End of Footer */}
      </div>
    </section>
  );
}
