import {
    WebSocket,
    isWebSocketCloseEvent,
    v4
} from "./deps";

const users = new Map<string, WebSocket>();

function broadcast(message: string, senderId?: string): void {
    if(!message) return
    for (const user of users.values()) {
        user.send(senderId ? `[${senderId}]: ${message}` : message);
    }
}

export async function chat(ws: WebSocket): Promise<void> {
    const userId = v4.generate();

    // register user connection
    users.set(userId, ws);
    broadcast(`> User with id: ${userId} connected`);

    // wait for new messages
    for await (const event of ws) {
        const message = typeof event === 'string' ? event : ''

        broadcast(message, userId)

        // unregister user connection
        if (!message && isWebSocketCloseEvent(event)) {
            users.delete(userId);
            broadcast(`> User with id: ${userId} disconnected`);
            break;
        }
    }
}
