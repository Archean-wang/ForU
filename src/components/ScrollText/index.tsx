import { Box } from "@mui/material";
import { ReactElement, useEffect, useRef, useState } from "react";
import debounce from "../../utils/debounce";

function ScrollText({ children }: { children: ReactElement }) {
  const ref = useRef<HTMLElement>(null);
  const [isScroll, setIsScroll] = useState(false);

  useEffect(() => {
    checkScroll();
    const tmp = debounce(checkScroll, 500);
    window.addEventListener("resize", tmp);
    return () => {
      window.removeEventListener("resize", tmp);
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
