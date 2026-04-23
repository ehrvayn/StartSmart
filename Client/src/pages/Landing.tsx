import { useState } from "react";

function Landing() {
  const [business, setBusiness] = useState("");
  const [location, setLocation] = useState("");

  return (
    <div className="p-20 border rounded-md text-lg">
      <div className="flex flex-col gap-3">
        <input
          className="p-3 rounded-md"
          placeholder="Tell me your Business Idea"
          value={business}
          onChange={(e) => setBusiness(e.target.value)}
        />
        <input
          className="p-3 rounded-md"
          placeholder="Tell me your Business Idea"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
    </div>
  );
}

export default Landing;
