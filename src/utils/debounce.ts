function debounce(fn:Function, delay:number) {
    let timeout: string | number | NodeJS.Timeout;
    return function(...args: any) {
        if(timeout) clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), delay);
    }
}

export default debounce;