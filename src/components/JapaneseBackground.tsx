"use client";

import { SakuraIcon, ToriiIcon, SushiIcon, KoiIcon, KimonoIcon, DoraemonIcon, PikachuIcon, HelloKittyIcon, DetectiveConanIcon } from './JapaneseIcons';

// Static arrangement of icons for visibility
const backgroundElements = [
  // Sakura icons
  { Icon: SakuraIcon, color: 'text-pink-400', top: '15%', left: '8%', size: 'w-16 h-16', rotation: 'rotate-12' },
  { Icon: SakuraIcon, color: 'text-pink-300', top: '65%', left: '15%', size: 'w-12 h-12', rotation: '-rotate-45' },
  { Icon: SakuraIcon, color: 'text-rose-400', top: '25%', left: '75%', size: 'w-14 h-14', rotation: 'rotate-30' },

  // Torii icons
  { Icon: ToriiIcon, color: 'text-red-400', top: '40%', right: '10%', size: 'w-18 h-18', rotation: '-rotate-12' },
  { Icon: ToriiIcon, color: 'text-red-300', top: '80%', left: '20%', size: 'w-16 h-16', rotation: 'rotate-45' },

  // Sushi icons
  { Icon: SushiIcon, color: 'text-orange-400', top: '20%', left: '45%', size: 'w-14 h-14', rotation: 'rotate-60' },
  { Icon: SushiIcon, color: 'text-orange-300', top: '70%', right: '20%', size: 'w-12 h-12', rotation: '-rotate-30' },

  // Koi icons
  { Icon: KoiIcon, color: 'text-blue-400', top: '35%', left: '5%', size: 'w-16 h-16', rotation: 'rotate-90' },
  { Icon: KoiIcon, color: 'text-blue-300', top: '55%', left: '85%', size: 'w-14 h-14', rotation: '-rotate-60' },

  // Kimono icons
  { Icon: KimonoIcon, color: 'text-purple-400', top: '10%', right: '25%', size: 'w-12 h-12', rotation: 'rotate-75' },

  // Doraemon icons
  { Icon: DoraemonIcon, color: 'text-cyan-400', top: '85%', right: '15%', size: 'w-16 h-16', rotation: '-rotate-90' },

  // Pikachu icons
  { Icon: PikachuIcon, color: 'text-yellow-400', top: '30%', left: '25%', size: 'w-14 h-14', rotation: 'rotate-15' },
  { Icon: PikachuIcon, color: 'text-yellow-300', top: '75%', right: '35%', size: 'w-12 h-12', rotation: '-rotate-75' },

  // Hello Kitty icons
  { Icon: HelloKittyIcon, color: 'text-pink-400', top: '50%', right: '5%', size: 'w-16 h-16', rotation: 'rotate-45' },
  { Icon: HelloKittyIcon, color: 'text-pink-300', top: '15%', left: '60%', size: 'w-13 h-13', rotation: '-rotate-30' },

  // Detective Conan icons
  { Icon: DetectiveConanIcon, color: 'text-blue-400', top: '60%', left: '70%', size: 'w-15 h-15', rotation: 'rotate-120' },
  { Icon: DetectiveConanIcon, color: 'text-blue-300', top: '90%', left: '40%', size: 'w-12 h-12', rotation: '-rotate-45' },
];

export default function JapaneseBackground() {
  // Get animation class based on index
  const getAnimationClass = (index: number) => {
    const animations = ['animate-float', 'animate-float-slow', 'animate-float-slower'];
    return animations[index % 3];
  };

  // Get delay class based on index
  const getDelayClass = (index: number) => {
    const delays = ['', 'animate-delay-1', 'animate-delay-2', 'animate-delay-3', 'animate-delay-4'];
    return delays[index % 5];
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Main decorative icons - all different types clearly visible */}
      {backgroundElements.map((element, index) => {
        const { Icon, color, top, left, right, size, rotation } = element;
        const animationClass = getAnimationClass(index);
        const delayClass = getDelayClass(index);

        return (
          <div
            key={`icon-${index}`}
            className={`absolute ${size} ${color} ${rotation} opacity-40 transition-all duration-1000 ${animationClass} ${delayClass}`}
            style={{
              top,
              left,
              right,
            }}
          >
            <Icon className="w-full h-full filter drop-shadow-lg" />
          </div>
        );
      })}

      {/* Additional floating elements with mixed icons */}
      <div className="absolute top-1/4 left-1/3 w-8 h-8 text-pink-400 opacity-40">
        <SakuraIcon className="w-full h-full animate-bounce-slow" />
      </div>
      <div className="absolute top-3/4 left-2/3 w-10 h-10 text-red-400 opacity-35">
        <ToriiIcon className="w-full h-full animate-pulse-slow" />
      </div>
      <div className="absolute top-1/2 left-1/4 w-8 h-8 text-orange-400 opacity-40">
        <SushiIcon className="w-full h-full animate-spin-very-slow" />
      </div>
      <div className="absolute top-1/3 right-1/4 w-9 h-9 text-blue-400 opacity-35">
        <KoiIcon className="w-full h-full animate-bounce-slower animate-delay-1" />
      </div>
      <div className="absolute bottom-1/4 left-1/2 w-7 h-7 text-purple-400 opacity-40">
        <KimonoIcon className="w-full h-full animate-pulse-slower animate-delay-2" />
      </div>
      <div className="absolute top-1/5 right-1/3 w-8 h-8 text-cyan-400 opacity-35">
        <DoraemonIcon className="w-full h-full animate-bounce-slowest animate-delay-3" />
      </div>
      <div className="absolute bottom-1/3 right-1/2 w-9 h-9 text-yellow-400 opacity-40">
        <PikachuIcon className="w-full h-full animate-pulse-slow animate-delay-1" />
      </div>
      <div className="absolute top-2/3 left-1/5 w-7 h-7 text-pink-400 opacity-35">
        <HelloKittyIcon className="w-full h-full animate-bounce-slower animate-delay-2" />
      </div>
      <div className="absolute top-1/6 left-1/2 w-8 h-8 text-blue-400 opacity-40">
        <DetectiveConanIcon className="w-full h-full animate-spin-ultra-slow animate-delay-4" />
      </div>

    </div>
  );
}