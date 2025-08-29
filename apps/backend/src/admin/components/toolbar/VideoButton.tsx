import React from "react";
import { Video } from "lucide-react";
import { MenuButton } from "./MenuButton";

interface VideoButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export const VideoButton: React.FC<VideoButtonProps> = ({ onClick, disabled }) => {
  return (
    <MenuButton
      onClick={onClick}
      disabled={disabled}
      title="Insert Video (YouTube/Vimeo)"
      aria-label="Insert video from YouTube or Vimeo"
    >
      <Video className="w-4 h-4" />
    </MenuButton>
  );
};