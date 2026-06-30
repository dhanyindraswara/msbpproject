export default function Toast({ message }) {
  if (!message) return null
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 26,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 120,
        background: '#1F2937',
        color: '#fff',
        fontSize: 13,
        fontWeight: 700,
        padding: '12px 20px',
        borderRadius: 999,
        boxShadow: '0 12px 34px rgba(0,0,0,.28)',
        animation: 'toastIn .24s ease',
      }}
    >
      {message}
    </div>
  )
}
