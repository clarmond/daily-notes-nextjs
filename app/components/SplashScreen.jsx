'use client';

const SplashScreen = () => {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#f8f9fa',
        zIndex: 9999
      }}
    >
      <div className="text-center">
        <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <h4 className="text-secondary">Daily Notes</h4>
        <p className="text-muted">Loading your tasks...</p>
      </div>
    </div>
  );
};

export default SplashScreen;
