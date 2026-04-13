import { useState, useEffect } from "react";

const cowImages = [
  "https://images.unsplash.com/photo-1544568100-847a948585b9?w=800&h=600&fit=crop&crop=center", // Dairy cow close-up
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&crop=center", // Holstein dairy cow
  "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=800&h=600&fit=crop&crop=center", // Dairy cow in pasture
  "https://images.unsplash.com/photo-1596733430284-f7437764b1a9?w=800&h=600&fit=crop&crop=center", // Dairy cow portrait
  "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=800&h=600&fit=crop&crop=center", // Jersey dairy cow
];

export default function CowSlideshow() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === cowImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {cowImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentImageIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={image}
            alt={`Cow ${index + 1}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.svg";
            }}
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-black/30" />
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {cowImages.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentImageIndex ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}