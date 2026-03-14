import Navbar from "../Components/Home/Navbar";
import HeroSection from "../Components/Home/HeroSection";
import FeaturesSection from "../Components/Home/FeatureSection";
import Footer from "../Components/Home/Footer";


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
