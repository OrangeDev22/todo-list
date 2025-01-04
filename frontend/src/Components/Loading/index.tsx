import React from "react";
import { motion } from "framer-motion";

const styleSpan = {
  display: "block",
  width: 48,
  height: 48,
  border: "7px solid #2D3134",
  borderTop: "7px solid #eee",
  borderRadius: "50%",
  boxSizing: "border-box",
};

const spinTransition = {
  repeat: Infinity,
  ease: "easeInOut",
  duration: 1,
};

const Loading = () => {
  return (
    <div className="w-12 h-12">
      <motion.span
        style={styleSpan}
        animate={{ rotate: 360 }}
        transition={spinTransition}
      />
    </div>
  );
};

export default Loading;
