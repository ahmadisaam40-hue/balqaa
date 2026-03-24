import { useEffect, useState } from "react";
import gsap from "gsap";

const IntroOverlay = ({ onComplete }: { onComplete: () => void }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setVisible(false);
        onComplete();
      },
    });

    tl.fromTo(
      ".intro-title",
      { opacity: 0, scale: 0.6, y: 30 },
      { opacity: 1, scale: 1, y: 0, duration: 1, ease: "back.out(1.4)" }
    )
      .to(".intro-title", {
        textShadow: "0 0 40px hsl(340 80% 70% / 0.6), 0 0 80px hsl(340 80% 70% / 0.3)",
        duration: 0.6,
        ease: "power2.inOut",
      })
      .to(".intro-subtitle", {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
      }, "-=0.3")
      .to(".intro-overlay", {
        opacity: 0,
        duration: 0.6,
        ease: "power2.inOut",
        delay: 0.5,
      });

    return () => { tl.kill(); };
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div className="intro-overlay fixed inset-0 z-[100] flex flex-col items-center justify-center gradient-hero">
      <h1 className="intro-title text-5xl md:text-7xl font-black text-primary opacity-0 mb-4">
        صيدلية البلقاء
      </h1>
      <p className="intro-subtitle text-lg md:text-xl text-muted-foreground opacity-0 translate-y-4">
        جمالك يبدأ من هنا ✨
      </p>
    </div>
  );
};

export default IntroOverlay;
