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
      className="bg-[var(--background)] p-8"
    >
      {/* Content Section */}
      <div className="flex w-full flex-col items-center justify-center gap-12 p-6 text-center md:flex-row">
        {/* Header */}
        <header className="w-80 text-left">
          <h1
            id="contact-heading"
            className="text-lg font-bold text-white md:text-3xl"
          >
            Contact Us
          </h1>
          <p className="text-xs font-light">
            Have any burning questions? Feel free to contact us through our
            email
          </p>
        </header>
        {/* End of Header */}

        {/* Form */}
        <form className="flex flex-col gap-6">
          <div className="flex gap-8">
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
            <motion.button
              type="button"
              className="w-full bg-[var(--cel-red)] py-1"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
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
