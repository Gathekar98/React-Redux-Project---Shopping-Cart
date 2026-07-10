import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hideNotification } from "../features/notification/notificationSlice";

function Toast(){
    const dispatch = useDispatch();

    const { message, type, isVisible } = useSelector((state) => state.notification);

    useEffect(() => {
        if(isVisible){
            // When toast becomes visible,
            const timer = setTimeout(() => {
                // wait 2 seconds, then hide it.
                dispatch(hideNotification());
            }, 2000);
            //this line is cleanup. It prevents old timers from creating bugs.
            return () => clearTimeout(timer);
        }
    },[isVisible, dispatch]);
    
    if(!isVisible){
        return null;
    }

    return <div className="{`toast toast-${type}`}">{message}</div>;
}

export default Toast;