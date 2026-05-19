const API_BASE = "/api";

type JsonRequestInit = Omit<RequestInit, "body"> & {
    body?: unknown;
};

async function parse<T>(res: Response): Promise<T> {
    const text = await res.text();
    if (!res.ok) throw new Error(text || `Request failed (${res.status})`);
    return (text ? JSON.parse(text) : null) as T;
}

async function request<T>(path: string, options: JsonRequestInit = {}): Promise<T> {
    const { body, headers, ...init } = options;
    const requestHeaders = new Headers(headers);

    if (body !== undefined && !requestHeaders.has("Content-Type")) {
        requestHeaders.set("Content-Type", "application/json");
    }

    const res = await fetch(API_BASE + path, {
        credentials: "include",
        ...init,
        headers: requestHeaders,
        body: body === undefined ? undefined : JSON.stringify(body),
    });

    return parse<T>(res);
}

export async function getJSON<T>(path: string): Promise<T> {
    return request<T>(path);
}

export async function postJSON<T>(path: string, body: unknown): Promise<T> {
    return request<T>(path, {
        method: "POST",
        body,
    });
}

export async function postEmpty(path: string): Promise<void> {
    await request<void>(path, {
        method: "POST",
    });
}
