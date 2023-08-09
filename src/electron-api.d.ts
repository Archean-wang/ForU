interface Window {
  electronAPI: {
    onCodeReady: (cb: (event: IpcRendererEvent, code: string) => void) => void;
    openURL: (url: string) => void;
    onToggle: (cb: (event: IpcRendererEvent) => void) => void;
    onNext: (cb: (event: IpcRendererEvent) => void) => void;
    onPrevious: (cb: (event: IpcRendererEvent) => void) => void;
    sendStatus: (puased: boolean) => void;
    removeEventListener: (
      name: string,
      cb: (event: IpcRendererEvent) => void
    ) => void;
  };
}
