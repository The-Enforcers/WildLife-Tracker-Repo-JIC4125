function CreditsPage() {
    const credits = [
      "Chase Hedelius - Lead Backend and Security",
      "Sean Johnson - Lead UI Designer and Search Creator",
      "Marko Milenkovic - Lead Designer and Create Post Page",
      "Edris Shahem - UI Designer and User Profile Page",
      "Sriteja Nara - Documentation"
    ];
  
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-6 text-center">Credits</h1>
          <ul className="space-y-4">
            {credits.map((credit, index) => (
              <li key={index} className="text-lg text-gray-700 text-center">
                {credit}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
  
  export default CreditsPage;