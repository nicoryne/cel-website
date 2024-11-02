'use client';

export default function PrimaryButton({
  children,
  onClick
}: {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <button
      className="w-full rounded-md bg-[var(--accent-primary)] px-8 py-1 font-bold uppercase text-white hover:bg-[var(--accent-primary-hover)] active:bg-[var(--accent-primary-active)]"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
