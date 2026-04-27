import Landing from "./pages/Landing";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="h-screen bg-white flex flex-col">
      <Navbar />
      <Landing />
    </div>
  );
}

export default App;
