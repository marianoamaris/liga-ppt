import React from "react";

interface AnnouncementCardProps {
  children: React.ReactNode;
  onClick: () => void;
}

export const AnnouncementCard: React.FC<AnnouncementCardProps> = ({
  children,
  onClick,
}) => (
  <div
    className="w-full mb-8 overflow-hidden transition-all duration-300 bg-white rounded-xl shadow-lg cursor-pointer hover:shadow-xl"
    onClick={onClick}
  >
    {children}
  </div>
);
