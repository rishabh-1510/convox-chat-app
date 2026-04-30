import Navbar from "../components_temp/Home/Navbar";
import HeroSection from "../components_temp/Home/HeroSection";
import FeaturesSection from "../components_temp/Home/FeatureSection";
import Footer from "../components_temp/Home/Footer";


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
