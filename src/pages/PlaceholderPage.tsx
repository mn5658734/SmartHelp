interface PlaceholderPageProps {
  title: string;
  description?: string;
}

export default function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div>
      <h1>{title}</h1>
      {description && <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>{description}</p>}
      <p style={{ marginTop: '1rem', color: '#9ca3af' }}>Coming soon.</p>
    </div>
  );
}
