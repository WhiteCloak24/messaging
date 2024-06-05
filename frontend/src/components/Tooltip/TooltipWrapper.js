import React, { useCallback, useRef } from "react";
import { dispatchCustomEventFn, generateRandomId } from "../../resources/functions";
import { TooltipEvent } from "../../resources/constants";

const TooltipWrapper = ({ children, tooltipText = "Dummy Text" }) => {
  const wrapperRef = useRef();
  const element_id = useRef(generateRandomId());
  const handleMouseEnter = useCallback(() => {
    dispatchCustomEventFn({ eventName: TooltipEvent.ENTER, eventData: { element_id: wrapperRef?.current?.id, tooltipText } });
  }, [wrapperRef]);
  const handleMouseLeave = useCallback(() => {
    dispatchCustomEventFn({ eventName: TooltipEvent.LEAVE, eventData: { element_id: wrapperRef?.current?.id, tooltipText } });
  }, [wrapperRef]);

  return (
    <span id={element_id.current} ref={wrapperRef} className="w-full h-full" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {children}
    </span>
  );
};

export default TooltipWrapper;
