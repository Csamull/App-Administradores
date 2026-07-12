class SessionStorage {
  private data: Record<string, string> = {};

  setItem(key: string, value: string) {
    this.data[key] = value;
  }

  getItem(key: string): string | null {
    return this.data[key] || null;
  }

  removeItem(key: string) {
    delete this.data[key];
  }

  clear() {
    this.data = {};
  }
}

export const sessionStorage = new SessionStorage();
