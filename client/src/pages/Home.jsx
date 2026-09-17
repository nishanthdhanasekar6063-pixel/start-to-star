import Navbar from "../components/Navbar";
import Hero from "../components/Hero";

function Home() {
  return (
    <div
      style={{
        minHeight: "150vh",
        position: "relative"
      }}
    >
      <Navbar />
      <Hero />
    </div>
  );
}

export default Home;