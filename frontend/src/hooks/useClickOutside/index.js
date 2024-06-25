import { useEffect } from "react";

const useClickOutside = ({ useDocument = true, backGround = () => null, ref = [], onClickOutsideCb = () => null }) => {
  useEffect(() => {
    function handleClickOutside(event) {
      let callFunction = false;
      if (ref && ref.length > 0) {
        for (let index = 0; index < ref.length; index++) {
          let refs = ref[index];
          if (refs.current && !refs.current.contains(event.target)) {
            callFunction = true;
          } else {
            callFunction = false;
            break;
          }
        }
        if (callFunction) {
          onClickOutsideCb();
        }
      }
    }
    
    backGround()
      ? backGround().addEventListener("mousedown", handleClickOutside)
      : useDocument
      ? document.addEventListener("mousedown", handleClickOutside)
      : (() => null)();
    return () => {
      backGround()
        ? backGround().removeEventListener("mousedown", handleClickOutside)
        : useDocument
        ? document.removeEventListener("mousedown", handleClickOutside)
        : (() => null)();
    };
  }, [ref, onClickOutsideCb, backGround, useDocument]);

  return;
};

export default useClickOutside;
