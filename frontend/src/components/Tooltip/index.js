import React, { useCallback, useEffect, useRef, useState } from "react";
import { TooltipEvent } from "../../resources/constants";

const initialState = {
  top: 0,
  left: 0,
  tooltipText: "",
};
const TooltipHandler = () => {
  const [tooltipContent, setTooltipContent] = useState(initialState);
  const observer = useRef(null);
  const tooltipElement = useRef();

  useEffect(() => {
    window.addEventListener(TooltipEvent.ENTER, handleTooltipEnter);
    window.addEventListener(TooltipEvent.LEAVE, handleTooltipLeave);
    return () => {
      window.removeEventListener(TooltipEvent.ENTER, handleTooltipEnter);
      window.removeEventListener(TooltipEvent.LEAVE, handleTooltipLeave);
    };
  }, []);

  const positionTooltip = (tooltipData) => {
    const element_id = tooltipData.element_id;
    const tooltipText = tooltipData.tooltipText;
    const element = document.getElementById(element_id);
    const { top, right, bottom, width, height, left } = element.getBoundingClientRect();
    const centerHeight = height / 2;
    const targetHeight = tooltipElement.current.offsetHeight / 2;
    const topCoordinate = top + centerHeight - targetHeight;
    setTooltipContent({ top: topCoordinate, left: right, tooltipText });
  };
  const handleTooltipEnter = useCallback(
    (e) => {
      const tooltipData = e.detail;
      positionTooltip(tooltipData);
      if (observer.current) {
        observer.current.disconnect();
      }
      const obs = new MutationObserver(() => {
        positionTooltip(tooltipData);
      });
      observer.current = obs;
      obs.observe(tooltipElement.current, { attributes: true });
    },
    [tooltipElement.current]
  );

  const handleTooltipLeave = useCallback(
    (e) => {
      if (observer) {
        observer.current.disconnect();
      }
      setTooltipContent(initialState);
    },
    [observer]
  );

  return (
    <>
      <span ref={tooltipElement} style={{ top: tooltipContent.top, left: tooltipContent.left + 1 }} className="bg-black rounded-md fixed ">
        {tooltipContent.tooltipText && <div className="tooltip p-2 w-fit h-fit text-sm text-white">{tooltipContent.tooltipText}</div>}
      </span>
    </>
  );
};

export default TooltipHandler;
