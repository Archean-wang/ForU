import { Box } from "@mui/material";
import React, { ReactElement, useEffect, useRef, useState } from "react";

function ScrollText({ children }: { children: ReactElement }) {
  const ref = useRef(null);
  const [isScroll, setIsScroll] = useState(false);

  useEffect(() => {
    if (ref.current) {
      const root = ref.current as HTMLElement;
      const parent = root.getClientRects()[0].width;
      const text = root.querySelector(":first-of-type");
      if (text) {
        const child = text.getClientRects()[0].width;
        parent < child ? setIsScroll(true) : setIsScroll(false);
      }
    }
  });

  return (
    <Box sx={{ pl: 1 }} className={isScroll ? "scrollText" : ""} ref={ref}>
      {children}
    </Box>
  );
}

export default ScrollText;
