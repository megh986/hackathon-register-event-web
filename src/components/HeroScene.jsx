import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import heroVideo from "../assets/video22.webm";

const featureTags = ["Innovate", "Collaborate", "Build", "Win"];
const headerTickerItems = [
  { label: "Live Coding Sprints", icon: "code", tone: "cyan" },
  { label: "AI Build Battles", icon: "chip", tone: "violet" },
  { label: "Pitch to Judges", icon: "spark", tone: "pink" },
  { label: "Team Matchmaking", icon: "group", tone: "gold" },
  { label: "Prototype Showcase", icon: "rocket", tone: "blue" },
  { label: "Midnight Debug Jam", icon: "bolt", tone: "mint" },
];

function TickerIcon({ type }) {
  if (type === "chip") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="7" y="7" width="10" height="10" rx="2" />
        <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" />
      </svg>
    );
  }

  if (type === "spark") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />
      </svg>
    );
  }

  if (type === "group") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM16 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
        <path d="M3 20a5 5 0 0 1 10 0M11 20a5 5 0 0 1 10 0" />
      </svg>
    );
  }

  if (type === "rocket") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M14 4c3 0 6 3 6 6-4 1-6 3-7.5 7.5C9 16 7 14 6.5 11 11 9.5 13 8 14 4Z" />
        <path d="M8 16l-3 3M9 12l3 3" />
      </svg>
    );
  }

  if (type === "bolt") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M13 2 5 14h5l-1 8 8-12h-5l1-8Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 7 3 12l5 5M16 7l5 5-5 5M14 4l-4 16" />
    </svg>
  );
}

export function HeroScene() {
  const sceneRef = useRef(null);
  const videoRef = useRef(null);
  const hasAttemptedPlayRef = useRef(false);
  const [isReady, setIsReady] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-reveal",
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          delay: 0.2,
        },
      );

      gsap.fromTo(
        ".ticker-track",
        { xPercent: 0 },
        {
          xPercent: -50,
          duration: 20,
          repeat: -1,
          ease: "none",
        },
      );

      gsap.to(".ticker-icon-wrap", {
        y: -3,
        scale: 1.06,
        duration: 1.8,
        stagger: {
          each: 0.08,
          repeat: -1,
          yoyo: true,
        },
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".ticker-pill__shine", {
        xPercent: 240,
        duration: 2.6,
        stagger: {
          each: 0.18,
          repeat: -1,
        },
        repeat: -1,
        ease: "power1.inOut",
      });

      gsap.to(".ticker-orb", {
        y: (index) => (index % 2 === 0 ? -8 : 8),
        x: (index) => (index % 2 === 0 ? 6 : -6),
        duration: 3 + Math.random(),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.15,
      });
    }, sceneRef);

    const handlePointerMove = (event) => {
      const target = sceneRef.current;

      if (!target) {
        return;
      }

      target.style.setProperty("--cursor-x", `${event.clientX}px`);
      target.style.setProperty("--cursor-y", `${event.clientY}px`);
    };

    window.addEventListener("pointermove", handlePointerMove);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;

    if (!video || hasAttemptedPlayRef.current) {
      return;
    }

    hasAttemptedPlayRef.current = true;
    video.muted = isMuted;
    video.volume = 1;

    const tryPlay = async () => {
      try {
        await video.play();
      } catch {
        // Some browsers require a user gesture before allowing audio playback.
      }
    };

    tryPlay();

    const resumePlayback = async () => {
      video.muted = isMuted;

      try {
        await video.play();
      } catch {
        // Ignore if the browser still refuses playback.
      }
    };

    window.addEventListener("pointerdown", resumePlayback, { once: true });

    return () => {
      window.removeEventListener("pointerdown", resumePlayback);
    };
  }, [isMuted]);

  const handleToggleMute = async () => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    const nextMuted = !isMuted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);

    if (!nextMuted) {
      try {
        await video.play();
      } catch {
        // Ignore if the browser still refuses playback until interaction.
      }
    }
  };

  const handleEnter = () => {
    const timeline = gsap.timeline();

    timeline
      .to(".video-hero__content", {
        y: -22,
        opacity: 0,
        duration: 0.45,
        ease: "power2.inOut",
      })
      .to(
        ".video-hero__media",
        {
          scale: 1.08,
          duration: 1.1,
          ease: "power3.inOut",
        },
        "<",
      )
      .to(
        ".video-hero__veil",
        {
          opacity: 0.2,
          duration: 0.8,
          ease: "power2.out",
        },
        "<",
      );
  };

  return (
    <section ref={sceneRef} className="video-hero">
      <div className={`video-hero__media${isReady ? " is-ready" : ""}`}>
        <video
          ref={videoRef}
          className="video-hero__video"
          src={heroVideo}
          autoPlay
          muted={false}
          loop
          playsInline
          preload="auto"
          onLoadedData={() => setIsReady(true)}
        />
        <div className="video-hero__veil" />
        <div className="video-hero__glow" />
      </div>

      <div className="video-hero__content">
        <header className="video-hero__nav hero-reveal">
          <div className="ticker-shell">
            <div className="ticker-window">
              <span className="ticker-orb ticker-orb--left" aria-hidden="true" />
              <span className="ticker-orb ticker-orb--mid" aria-hidden="true" />
              <span className="ticker-orb ticker-orb--right" aria-hidden="true" />

              <div className="ticker-track">
                {[...headerTickerItems, ...headerTickerItems].map((item, index) => (
                  <div
                    key={`${item.label}-${index}`}
                    className={`ticker-pill ticker-pill--${item.tone}`}
                  >
                    <span className="ticker-icon-wrap" aria-hidden="true">
                      <span className="ticker-icon">
                        <TickerIcon type={item.icon} />
                      </span>
                    </span>
                    <span className="ticker-label">{item.label}</span>
                    <span className="ticker-pill__shine" aria-hidden="true" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            type="button"
            className="audio-control"
            onClick={handleToggleMute}
            aria-label={isMuted ? "Unmute video" : "Mute video"}
            title={isMuted ? "Unmute video" : "Mute video"}
          >
            <span className="audio-control__icon" aria-hidden="true">
              {isMuted ? "🔇" : "🔊"}
            </span>
          </button>
        </header>

        <div className="video-hero__copy">
          <h1 className="hero-reveal video-hero__title">
            Enter the <span>Hackathon</span> World
          </h1>

          <p className="lead hero-reveal">
            A cinematic entry point for real-world builders. Step into the
            energy, explore offline events, and move straight into the
            hackathon experience.
          </p>

          <div className="cta-row hero-reveal">
            <button
              type="button"
              className="primary-btn"
              onClick={handleEnter}
            >
              Start Journey
              <span aria-hidden="true">-&gt;</span>
            </button>
            <button type="button" className="secondary-btn">
              Explore Events
            </button>
          </div>

          <div className="video-hero__tags hero-reveal">
            {featureTags.map((tag) => (
              <span key={tag} className="video-hero__tag">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
