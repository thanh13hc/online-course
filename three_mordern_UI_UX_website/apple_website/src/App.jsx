import "./App.css";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Highlights from "./components/Highlights";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import Model from "./components/Model";
import * as Sentry from "@sentry/react";
import Features from "./components/Features";
import HowwItWorks from "./components/HowwItWorks";
import Footer from "./components/Footer";

gsap.registerPlugin(ScrollTrigger);

// eslint-disable-next-line react-refresh/only-export-components
function App() {
  return (
    <main className="bg-black">
      <Navbar />
      <Hero />
      <Highlights />
      <Model />
      <Features />
      <HowwItWorks />
      <Footer />
    </main>
  );
}

export default Sentry.withProfiler(App);
