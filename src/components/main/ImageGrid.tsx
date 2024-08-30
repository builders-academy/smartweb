import React from "react";
import { Button } from "../ui/button";

const ImageGrid: React.FC = () => {
  const images = [
    {
      id: 1,
      link: "https://www.gobob.xyz",
      src: "BOB.png",
      alt: "Image 1",
      popupText: "Build On Bitcoin",
    },
    {
      id: 2,
      link: "https://internetcomputer.org",
      src: "ICP.png",
      alt: "Image 2",
      popupText: "ICP",
    },
    {
      id: 3,
      link: "https://litecoin.org",
      src: "LiteCoin.png",
      alt: "Image 3",
      popupText: "LiteCoin",
    },
    {
      id: 4,
      link: "https://www.lorenzo-protocol.xyz",
      src: "lorenzo.png",
      alt: "Image 4",
      popupText: "Lorenzo",
    },
    {
      id: 5,
      link: "https://merlinchain.io",
      src: "merlin.png",
      alt: "Image 5",
      popupText: "Merlin",
    },
    {
      id: 6,
      link: "https://rootstock.io",
      src: "RootStack.png",
      alt: "Image 6",
      popupText: "RootStock",
    },
    {
      id: 7,
      link: "https://www.stacks.co",
      src: "stacks-stx-logo.png",
      alt: "Image 7",
      popupText: "Stacks",
    },
    {
      id: 8,
      link: "https://www.velar.co",
      src: "Velar.png",
      alt: "Image 8",
      popupText: "Velar",
    },
  ];

  return (
    <div className="">
      <div className="grid grid-cols-4 gap-2 justify-items-center">
        {images.map((image) => (
          <a
            href={image.link}
            key={image.id}
            className="relative group flex items-center justify-center w-20 h-20"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={image.src} alt={image.alt} className="w-20 max-h-20" />
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {image.popupText}
            </div>
          </a>
        ))}
      </div>
      <div className="flex my-4 mx-9">
        <a href="https://forms.gle/EZcHXfXnAjGU5xb96" target="_blank">
          <Button>Signup here to get early updates</Button>
        </a>
      </div>
    </div>
  );
};

export default ImageGrid;
