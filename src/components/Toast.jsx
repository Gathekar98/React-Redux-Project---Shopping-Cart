import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hideNotification } from "../features/notification/notificationSlice";

function Toast(){
    const dispatch = useDispatch();

    const { message, type, isVisible } = useSelector((state) => state.notification);

    useEffect(() => {
        if(isVisible){
            const timer = setTimeout(() => {
                dispatch(hideNotification());
            }, 2000);
            return () => clearTimeout(timer);
        }
    },[isVisible, dispatch]);
    
    if(!isVisible){
        return null;
    }

    return (
        <div className={`toast toast-${type}`} role="status" aria-live="polite">
            <span className="toast-dot"></span>
            <span>{message}</span>
        </div>
    );
}

export default Toast;
