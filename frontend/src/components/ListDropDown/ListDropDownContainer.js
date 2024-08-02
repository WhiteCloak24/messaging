import React, { useCallback, useEffect, useRef, useState } from "react";
import { DropdownEvent, ZINDEX } from "../../resources/constants";

const ListDropDownContainer = () => {
  const dropdownElement = useRef();
  const [show, setShow] = useState(false);
  const [dropdownInfo, setDropdownInfo] = useState(null);

  useEffect(() => {
    window.addEventListener(DropdownEvent.OPEN, handleDropDownOpen);
    window.addEventListener(DropdownEvent.CLOSE, handleDropDownClose);
    return () => {
      window.removeEventListener(DropdownEvent.OPEN, handleDropDownOpen);
      window.removeEventListener(DropdownEvent.CLOSE, handleDropDownClose);
    };
  }, []);

  useEffect(() => {
    if (show && dropdownInfo) {
      updateOpenDom();
    }
  }, [show]);

  const handleDropDownOpen = useCallback((e) => {
    setShow(true);
    setDropdownInfo(e.detail);
  }, []);
  const handleDropDownClose = useCallback((e) => {
    setShow(false);
    setDropdownInfo(null);
  }, []);

  const updateOpenDom = useCallback(() => {
    const id = dropdownInfo.tooltipId || "";
    const elementRef = document.getElementById(`ns-dropdown-ref-${id}`);
    if (elementRef) {
      const { top, left, height, width, bottom } = elementRef.getBoundingClientRect();
      // for bottom
      // tooltipElement.current.style.top = `${bottom}px`;
      // tooltipElement.current.style.left = `${left + width / 2}px`;
      // tooltipElement.current.style.transform = `translateX(-50%)`;
      // tooltipElement.current.style["margin-top"] = "10px";
      // for top
      dropdownElement.current.style.top = `${top}px`;
      dropdownElement.current.style.left = `${left + width / 2}px`;
      //   dropdownElement.current.style.left = `${left + width / 2}px`;
      console.log(left, width);
      dropdownElement.current.style.transform = `translate(-50%,-100%)`;
      dropdownElement.current.style["z-index"] = ZINDEX.Dropdown;
      // tooltipElement.current.style["margin-bottom"] = "10px";
    }
  }, [dropdownInfo, show]);

  const arr = [{ label: "1x" }, { label: "1.5x" }, { label: "2x" }];

  return (
    <>
      {show && (
        <div
          ref={dropdownElement}
          style={{ minWidth: dropdownInfo ? window.getComputedStyle(dropdownInfo?.element?.target).width : "auto" }}
          className={`ns-list-dropdown ${dropdownInfo.className || ""}`}>
          {arr.map((dropdownItem) => {
            return <div className="ns-list-dropdown-item">{dropdownItem.label}</div>;
          })}
        </div>
      )}
    </>
  );
};

export default ListDropDownContainer;
