'use client';
interface TestProps {
  data: any[];
}

export default function TestComponent({ data }: TestProps) {
  return (
    <ul>
      {data.map((data) => (
        <li key={data.id}>
          {data.player.ingame_name}: {data.acs}
        </li>
      ))}
    </ul>
  );
}
