import React, { useCallback, useRef } from "react";
import { dispatchCustomEventFn, generateRandomId } from "../../resources/functions";
import { DropdownEvent } from "../../resources/constants";
import useClickOutside from "../../hooks/useClickOutside";

const ListDropDown = ({ children, className = "", dropDownList = [] }) => {
  const id = useRef(generateRandomId());
  const targetElementRef = useRef();

  const handleOpen = useCallback(
    (_, id) => {
      dispatchCustomEventFn({
        eventName: DropdownEvent.OPEN,
        eventData: { dropDownList, tooltipId: id, element: _, className },
      });
    },
    [dropDownList, className]
  );

  const handleClose = useCallback((_) => {
    dispatchCustomEventFn({
      eventName: DropdownEvent.CLOSE,
      eventData: {},
    });
  }, []);

  useClickOutside({
    useDocument: true,
    ref: [targetElementRef],
    onClickOutsideCb: handleClose,
  });
  if (React.isValidElement(children)) {
    // Clone the child and append the className to its existing className
    return React.cloneElement(children, {
      ref: targetElementRef,
      id: "ns-dropdown-ref-" + id.current,
      className: `${children.props.className ? children.props.className + " ns-dropdown" : `ns-dropdown`} ${className}`,
      onClick: (e) => {
        handleOpen(e, id.current);
      },
      //   onMouseLeave: (e) => handleMouseLeave(e, id),
    });
  }
};

export default ListDropDown;
