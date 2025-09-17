export interface HarEntry {
  request: {
    url: string;
    method: string;
  };
  response: {
    status: number;
  };
}

export interface Har {
  log: {
    entries: HarEntry[];
  };
}
