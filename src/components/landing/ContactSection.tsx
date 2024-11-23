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
      id="contact"
      className="bg-[var(--cel-background)]"
      aria-labelledby="contact-heading"
    >
      {/* Content Section */}
      <div className="flex w-full flex-col items-center justify-center space-y-16 p-6 text-center md:p-12 lg:p-24">
        {/* Header */}
        <header className="mb-6">
          <h1
            id="contact-heading"
            className="border-b-2 border-[var(--cel-red)] py-4 text-5xl font-bold text-[var(--cel-red)]"
          >
            Contact Us
          </h1>
        </header>
        {/* End of Header */}

        {/* Form */}
        <form className="mb-4 mt-8 grid gap-2 space-y-4 rounded-lg bg-[var(--cel-navy)] p-8 shadow-lg md:grid-cols-2">
          {/* First Name Group */}
          <div className="col-span-2 flex flex-col justify-end space-y-2 md:col-span-1">
            <div className="flex flex-col items-start">
              <label
                htmlFor="fname"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                First Name
              </label>
              <input
                name="fname"
                id="fname"
                placeholder="Junior"
                className="text-md flex-1 rounded-md border-none bg-[var(--background)] p-2 text-[var(--text-dark)] outline-none ring-0 focus:ring-0"
                type="name"
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
          </div>

          {/* Last Name Group */}
          <div className="col-span-2 flex flex-col justify-end space-y-2 md:col-span-1">
            <div className="flex flex-col items-start">
              <label
                htmlFor="lname"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                Last Name
              </label>
              <input
                name="lname"
                id="lname"
                placeholder="Marlon"
                className="text-md flex-1 rounded-md border-none bg-[var(--background)] p-2 text-[var(--text-dark)] outline-none ring-0 focus:ring-0 md:indent-1"
                type="name"
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          {/* Email Address Group */}
          <div className="col-span-2 flex flex-col justify-end space-y-2">
            <div className="flex flex-col items-start space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-900 dark:text-white"
              >
                Email Address
              </label>
              <input
                name="email"
                id="email"
                placeholder="example@gmail.com"
                className="text-md w-full flex-1 rounded-md border-none bg-[var(--background)] p-2 indent-1 text-[var(--text-dark)] outline-none ring-0 focus:ring-0"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
              />
              {errorEmail && (
                <p className="text-xs font-semibold text-red-400">
                  {errorEmail}
                </p>
              )}
            </div>
          </div>

          {/* Message Group */}
          <div className="col-span-2 flex flex-col justify-end space-y-2">
            <div className="flex flex-col items-start">
              <label
                htmlFor="message"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                Message
              </label>
              <textarea
                name="message"
                id="message"
                rows={4}
                placeholder="Hello, I'm writing about..."
                className="text-md w-full flex-1 rounded-md border-none bg-[var(--background)] text-[var(--text-dark)] outline-none ring-0 focus:ring-0"
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="col-span-2">
            <motion.button
              className="w-full rounded-md border-none bg-[var(--cel-red)] px-8 py-3 text-center text-lg font-bold text-white"
              whileHover={{ scale: 1.02 }}
            >
              Submit
            </motion.button>
          </div>
        </form>
        {/* End of Form */}

        {/* End of Footer */}
      </div>
    </section>
  );
}
