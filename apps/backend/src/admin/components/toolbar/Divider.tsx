import React from "react";

export const Divider = React.memo(() => (
  <div
    className="w-px h-6 bg-gray-300 mx-1"
    role="separator"
    aria-orientation="vertical"
  />
));