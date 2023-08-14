interface Callback {
  (event: IpcRendererEvent): void;
}

interface Window {
  electronAPI: {
    onCodeReady: (cb: (event: IpcRendererEvent, code: string) => void) => void;
    openURL: (url: string) => void;
    onToggle: (cb: Callback) => void;
    onNext: (cb: Callback) => void;
    onPrevious: (cb: Callback) => void;
    sendStatus: (puased: boolean) => void;
    removeAllListeners: (name: string) => void;
    onVolumeAdd: (cb: Callback) => void;
    onVolumeSub: (cb: Callback) => void;
    getSetting: (key: string) => Promise<any>;
    getSettings: () => Promise<any>;
    setSettings: (key: string, value: any) => void;
    checkUpdate: () => void;
    updateNow: () => void;
    onUpdateError: (
      cb: (event: IpcRendererEvent, mesage: string) => void
    ) => void;
    onUpdatAvailable: (
      cb: (event: IpcRendererEvent, info: string) => void
    ) => void;
    onDownloadProgress: (
      cb: (event: IpcRendererEvent, info: string) => void
    ) => void;
    onUpdatDownloaded: (cb: Callback) => void;
  };
}
