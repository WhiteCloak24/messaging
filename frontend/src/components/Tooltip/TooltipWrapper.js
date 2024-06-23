import React, { useCallback, useRef } from "react";
import {
  dispatchCustomEventFn,
  generateRandomId,
} from "../../resources/functions";
import { TooltipEvent } from "../../resources/constants";

const TooltipWrapper = ({
  children,
  className = "",
  tooltipText = "Dummy Text",
}) => {
  const handleMouseEnter = useCallback(() => {
    dispatchCustomEventFn({
      eventName: TooltipEvent.ENTER,
      eventData: { tooltipText },
    });
  }, []);
  const handleMouseLeave = useCallback(() => {
    dispatchCustomEventFn({
      eventName: TooltipEvent.LEAVE,
      eventData: { tooltipText },
    });
  }, []);

  if (React.isValidElement(children)) {
    // Clone the child and append the className to its existing className
    return React.cloneElement(children, {
      className: `${
        children.props.className
          ? children.props.className + " ns-tooltip-ref"
          : "ns-tooltip-ref "
      }${className}`,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
    });
  }

  return children;
};

export default TooltipWrapper;
