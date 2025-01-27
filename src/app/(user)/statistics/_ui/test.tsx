'use client';
interface TestProps {
  data: any[];
}

export default function TestComponent({ data }: TestProps) {
  console.log(data);
  return <p>Test Component</p>;
}
