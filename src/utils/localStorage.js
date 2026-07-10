export const loadFromLocalStorage = (key) => {
    try{
        const savedData = localStorage.getItem(key);
        if(savedData == null) {
            return undefined;
        }
        return JSON.parse(savedData);
    }
    catch(error) {
        console.log(`Could not load ${key} from localStorage`, error);
        return undefined;
    }
};

export const saveToLocalStorage = (key, data) => {
    try{
        const dataString = JSON.stringify(data);
        localStorage.setItem(key, dataString);
    }
    catch(error) {
        console.log(`Could not save ${key} to localStorage`, error);
    }
};