export const getURL = () => localStorage.getItem("SERVER_URL") || "";
export const getKey = () => localStorage.getItem("AUTH_KEY") || "";

export function getStateFromURL<T>(currentState: T): T {
    const params = new URL(window.location.href).searchParams;
    const state: T = {} as T;
    for (const [key, value] of Object.entries(currentState)) {
        const val = params.get(key);
        (state as Record<string, unknown>)[key] = val || value;
    }
    return state;
}
