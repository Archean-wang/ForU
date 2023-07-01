import { Box } from "@mui/material";
import { ReactElement, useEffect, useRef, useState } from "react";

function ScrollText({ children }: { children: ReactElement }) {
  const ref = useRef<HTMLElement>(null);
  const [isScroll, setIsScroll] = useState(false);

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => {
      window.removeEventListener("resize", checkScroll);
    };
  });

  function checkScroll() {
    if (ref.current) {
      const root = ref.current;
      const parent = root.getClientRects()[0].width;
      const text = root.querySelector("p:first-of-type");
      if (text) {
        const child = text.getClientRects()[0].width;
        parent < child ? setIsScroll(true) : setIsScroll(false);
      }
    }
  }

  return (
    <Box
      sx={{ pl: 1, overflow: "hidden" }}
      className={isScroll ? "scrollText" : ""}
      ref={ref}>
      {children}
    </Box>
  );
}

export default ScrollText;
