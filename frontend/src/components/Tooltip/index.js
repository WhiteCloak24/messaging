import React, { useCallback, useEffect, useRef, useState } from "react";
import { TooltipEvent } from "../../resources/constants";

const TooltipHandler = () => {
  const [tooltipText, setTooltipText] = useState("");
  const tooltipElement = useRef();

  useEffect(() => {
    window.addEventListener(TooltipEvent.ENTER, handleTooltipEnter);
    window.addEventListener(TooltipEvent.LEAVE, handleTooltipLeave);
    return () => {
      window.removeEventListener(TooltipEvent.ENTER, handleTooltipEnter);
      window.removeEventListener(TooltipEvent.LEAVE, handleTooltipLeave);
    };
  }, []);

  const handleTooltipEnter = useCallback(
    (e) => {
      const id = e.detail.tooltipId || "";
      const elementRef = document.getElementsByClassName(`ns-tooltip-ref-${id}`)?.[0];
      if (elementRef) {
        const { top, left, height, width, bottom } =
          elementRef.getBoundingClientRect();
        // for bottom
        // tooltipElement.current.style.top = `${bottom}px`;
        // tooltipElement.current.style.left = `${left + width / 2}px`;
        // tooltipElement.current.style.transform = `translateX(-50%)`;
        // tooltipElement.current.style["margin-top"] = "10px";
        // for top
        tooltipElement.current.style.top = `${top}px`;
        tooltipElement.current.style.left = `${left + width / 2}px`;
        tooltipElement.current.style.transform = `translate(-50%,-100%)`;
        // tooltipElement.current.style["margin-bottom"] = "10px";
      }
      setTooltipText(e.detail.tooltipText || "");
    },
    [tooltipElement.current]
  );

  const handleTooltipLeave = useCallback(
    (e) => {
      const id = e.detail.tooltipId || "";
      const elementRef = document.getElementsByClassName(`ns-tooltip-ref-${id}`)?.[0];
      if (elementRef) {
        setTooltipText("");
      }
    },
    [tooltipElement.current]
  );

  return (
    <>
      <div ref={tooltipElement} className="tooltip absolute">
        {tooltipText && (
          <div className="tooltip p-2 w-fit h-fit text-sm text-white bg-black rounded-md mb-2">
            {tooltipText}
          </div>
        )}
      </div>
    </>
  );
};

export default TooltipHandler;
