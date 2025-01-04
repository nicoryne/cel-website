'use client';

import React from 'react';
import emailjs from '@emailjs/browser';
import Image from 'next/image';
import { motion } from 'framer-motion';
import contact_us from '@/../public/images/contact_us.webp';

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
      className="mx-auto bg-[var(--background)] lg:py-16"
    >
      <motion.div
        className="mx-auto grid w-full lg:w-[80vw] lg:grid-cols-2 lg:py-8"
        whileInView={{ opacity: [0.6, 1], scale: [0.97, 1] }}
        initial={{ opacity: 0.6, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        {/* Image */}
        <div className="relative lg:order-2">
          <Image
            src={contact_us}
            alt="CEL Staff Media"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            quality={95}
            className="h-full w-full object-cover lg:rounded-r-lg"
          />
        </div>

        <div className="lg:order-1">
          <div className="flex h-full flex-col justify-center gap-8 px-8 py-16 md:rounded-l-lg md:p-8 lg:bg-neutral-900">
            <header className="flex flex-col gap-4">
              <h2 className="bg-gradient-to-r from-[var(--cel-blue)] to-[var(--hero-blue-end)] bg-clip-text text-4xl font-bold uppercase text-transparent">
                Contact Us
              </h2>
              <p className="text-base">
                Have questions or need assistance? We're here to help! Feel free
                to send us a message through this form.
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
                    className="ease rounded-md bg-[var(--background)] p-3 text-sm text-white transition-colors duration-200 focus:border-neutral-300 focus:ring-neutral-100"
                    autoComplete="given-name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
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
                    className="ease rounded-md bg-[var(--background)] p-3 text-sm text-white transition-colors duration-200 focus:border-neutral-300 focus:ring-neutral-100"
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
                  className="ease rounded-md bg-[var(--background)] p-3 text-sm text-white transition-colors duration-200 focus:border-neutral-300 focus:ring-neutral-100"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errorEmail && (
                  <p className="text-xs text-red-500">{errorEmail}</p>
                )}
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
                  className="ease resize-none rounded-md bg-[var(--background)] p-4 text-sm text-white transition-colors duration-200 focus:border-neutral-300 focus:ring-neutral-100"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <div className="flex w-full justify-end">
                <button
                  type="submit"
                  className="text-md w-full rounded-md bg-[var(--cel-red)] py-2 text-neutral-200 duration-200 ease-linear hover:bg-red-600"
                >
                  Submit
                </button>
              </div>
            </form>

            {/* Success/Error Messages */}
            {successMessage && (
              <p className="text-xs text-green-500">{successMessage}</p>
            )}
            {errorMessage && (
              <p className="text-xs text-red-500">{errorMessage}</p>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
