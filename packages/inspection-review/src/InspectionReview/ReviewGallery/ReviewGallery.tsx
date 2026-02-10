export function ReviewGallery() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', flex: 6, gap: 8 }}>
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          style={{
            height: 152,
            width: 140,
            backgroundColor: 'gray',
            textAlign: 'center',
          }}
        >
          Item {i + 1}
        </div>
      ))}
    </div>
  );
}
