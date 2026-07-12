import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SplashScreen from "@/components/SplashScreen";

const Index = () => {
  const [splashDone, setSplashDone] = useState(false);
  const navigate = useNavigate();

  const handleSplashFinish = () => {
    setSplashDone(true);
    navigate("/login");
  };

  return (
    <>
      {!splashDone && <SplashScreen onFinish={handleSplashFinish} />}
      <div className="min-h-screen bg-background" />
    </>
  );
};

export default Index;
