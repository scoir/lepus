import { useEffect, useRef } from 'react';

export function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
        if (savedCallback.current !== undefined) {
            // @ts-ignore
            savedCallback.current();
        }
    }

    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => {
          console.log("attempting to clear", id)
          clearInterval(id)
      };
    }
  }, [delay]);
}