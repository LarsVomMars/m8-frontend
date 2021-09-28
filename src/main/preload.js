const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
    ipcRenderer: {
        myPing() {
            ipcRenderer.send("ipc-example", "ping");
        },
        on(channel, func) {
            const validChannels = ["ipc-example"];
            if (validChannels.includes(channel)) {
                // Deliberately strip event as it includes `sender`
                ipcRenderer.on(channel, (_event, ...args) => func(...args));
            }
        },
        once(channel, func) {
            const validChannels = ["ipc-example"];
            if (validChannels.includes(channel)) {
                // Deliberately strip event as it includes `sender`
                ipcRenderer.once(channel, (_event, ...args) => func(...args));
            }
        },
    },
});
