import Navbar from "../components/Home/Navbar";
import HeroSection from "../components/Home/HeroSection";
import FeaturesSection from "../components/Home/FeatureSection";
import Footer from "../components/Home/Footer";


const Home= () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar/>
      <HeroSection/>
      <FeaturesSection/>
      <Footer/>
    </div>
  );
};

export default Home;
