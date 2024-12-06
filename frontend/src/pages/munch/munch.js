function MunchPage() {
    return (
      <div
        style={{
          width: '100vw',
          height: '100vh',
          backgroundImage: "url('/iStock.jpg')", // Remove '../../public'
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <audio 
          src="/gHpZVtp.mp3" 
          autoPlay 
          loop 
          controls // Add controls for debugging
          playsInline // Better mobile support
        />
      </div>
    );
  }
  
  export default MunchPage;