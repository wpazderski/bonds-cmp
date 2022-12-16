import { BondsState } from "./BondsSlice";
import { SettingsState } from "./SettingsSlice";

export interface ExportedData {
    bonds: BondsState;
    settings: SettingsState;
}

export class ExportImport {
    
    private static LOCAL_STORAGE_KEY: string = "treasury-bonds-profitability-data";
    private static initialized: boolean = false;
    
    static ensureInitialized(importer: (data: ExportedData) => void): void {
        if (this.initialized) {
            return;
        }
        this.initialized = true;
        const fromUrl = this.importFromUrl();
        const fromLocalStorage = this.importFromLocalStorage();
        const data = fromUrl ?? fromLocalStorage;
        if (!data) {
            return;
        }
        importer(data);
    }
    
    static saveToLocalStorage(data: ExportedData): void {
        localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(data));
    }
    
    static importFromLocalStorage(): ExportedData | null {
        const dataStr = localStorage.getItem(this.LOCAL_STORAGE_KEY);
        return dataStr === null ? null : JSON.parse(dataStr);
    }
    
    static removeFromLocalStorage(): void {
        localStorage.removeItem(this.LOCAL_STORAGE_KEY);
    }
    
    static async export(data: ExportedData): Promise<void> {
        const blob = new Blob([JSON.stringify(data)], { type: "text/json" });
        const url = window.URL.createObjectURL(blob);
        const el = document.createElement("a");
        el.href = url;
        el.download = `bonds-${this.getCurrentDateTimeString()}.json`;
        el.style.display = "none";
        document.body.appendChild(el);
        el.click();
        el.remove();
        window.URL.revokeObjectURL(url);
    }
    
    static async import(file: File): Promise<ExportedData> {
        const resultStr = await file.text();
        const result = JSON.parse(resultStr);
        return result;
    }
    
    static exportToUrl(data: ExportedData): string {
        const dataStr = JSON.stringify(data);
        let url = window.location.href.split("#")[0];
        url += "#" + encodeURIComponent(dataStr);
        return url;
    }
    
    static importFromUrl(): ExportedData | null {
        try {
            const dataStr = decodeURIComponent(window.location.hash.substring(1));
            const data = JSON.parse(dataStr);
            return data;
        }
        catch {}
        return null;
    }
    
    static async copyUrl(url: string): Promise<void> {
        await navigator.clipboard.writeText(url);
    }
    
    private static getCurrentDateTimeString(): string {
        const dt = new Date();
        const d = dt.getDate();
        const m = dt.getMonth() + 1;
        const Y = dt.getFullYear();
        const h = dt.getHours();
        const i = dt.getMinutes();
        return `${Y}-${m}-${d}_${h}-${i}`;
    }
    
}
