import { acceptWebSocket, acceptable, listenAndServe } from "./deps";
import { chat } from "./chat";

listenAndServe({ port:3000 }, async (req) => {
	if (req.method === "GET" && req.url === "/") {
		req.respond({
			status: 200,
			headers: new Headers({
				"content-type": "text/html",
			}),
			body: await Deno.open("./index.html"),
		});
	}

	// websockets chat
	if (req.method === "GET" && req.url === "/ws") {
		if (acceptable(req)) {
			acceptWebSocket({
				conn: req.conn,
				bufReader: req.r,
				bufWriter: req.w,
				headers: req.headers,
			}).then(chat);
		}
	}
});

console.log("Server running => localhost:3000");
