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
  const id = generateRandomId();
  const handleMouseEnter = useCallback((_, id) => {
    dispatchCustomEventFn({
      eventName: TooltipEvent.ENTER,
      eventData: { tooltipText, tooltipId: id },
    });
  }, []);
  const handleMouseLeave = useCallback((_, id) => {
    dispatchCustomEventFn({
      eventName: TooltipEvent.LEAVE,
      eventData: { tooltipText, tooltipId: id },
    });
  }, []);

  if (React.isValidElement(children)) {
    // Clone the child and append the className to its existing className
    return React.cloneElement(children, {
      className: `${
        children.props.className
          ? children.props.className + " ns-tooltip-ref-" + id
          : `ns-tooltip-ref-${id} `
      }${className}`,
      onMouseEnter: (e) => handleMouseEnter(e, id),
      onMouseLeave: (e) => handleMouseLeave(e, id),
    });
  }

  return children;
};

export default TooltipWrapper;
