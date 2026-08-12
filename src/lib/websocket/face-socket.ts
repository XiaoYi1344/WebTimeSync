// import {
//   websocketConfig,
// } from "./config";

// import type {
//   FaceAction,
//   FaceSocketClientMessage,
//   FaceSocketServerMessage,
// } from "./types";

// type MessageHandler = (
//   message: FaceSocketServerMessage,
// ) => void;

// type StatusHandler = (
//   status:
//     | "idle"
//     | "connecting"
//     | "connected"
//     | "scanning"
//     | "success"
//     | "error"
//     | "closed",
// ) => void;

// interface StartOptions {
//   action: FaceAction;
//   sessionId: string;
// }

// export class FaceWebSocket {
//   private socket: WebSocket | null = null;

//   private messageHandler:
//     | MessageHandler
//     | null = null;

//   private statusHandler:
//     | StatusHandler
//     | null = null;

//   private sessionId: string | null = null;

//   private mockTimer:
//     | ReturnType<typeof setTimeout>
//     | null = null;

//   private isStopped = false;

//   constructor() {}

//   onMessage(handler: MessageHandler) {
//     this.messageHandler = handler;

//     return () => {
//       if (this.messageHandler === handler) {
//         this.messageHandler = null;
//       }
//     };
//   }

//   onStatus(handler: StatusHandler) {
//     this.statusHandler = handler;

//     return () => {
//       if (this.statusHandler === handler) {
//         this.statusHandler = null;
//       }
//     };
//   }

//   private setStatus(
//     status: Parameters<StatusHandler>[0],
//   ) {
//     this.statusHandler?.(status);
//   }

//   async connect() {
//     if (websocketConfig.mode === "mock") {
//       this.setStatus("connected");
//       return;
//     }

//     if (
//       this.socket?.readyState ===
//       WebSocket.OPEN
//     ) {
//       return;
//     }

//     this.setStatus("connecting");

//     return new Promise<void>((resolve, reject) => {
//       const socket = new WebSocket(
//         websocketConfig.url,
//       );

//       this.socket = socket;

//       socket.onopen = () => {
//         this.setStatus("connected");
//         resolve();
//       };

//       socket.onmessage = (event) => {
//         try {
//           const message =
//             JSON.parse(
//               event.data,
//             ) as FaceSocketServerMessage;

//           this.messageHandler?.(message);
//         } catch (error) {
//           console.error(
//             "Invalid WebSocket message",
//             error,
//           );
//         }
//       };

//       socket.onerror = () => {
//         this.setStatus("error");
//         reject(
//           new Error(
//             "WebSocket connection failed",
//           ),
//         );
//       };

//       socket.onclose = () => {
//         this.setStatus("closed");
//         this.socket = null;
//       };
//     });
//   }

//   async start({
//     action,
//     sessionId,
//   }: StartOptions) {
//     this.isStopped = false;
//     this.sessionId = sessionId;

//     await this.connect();

//     this.setStatus("scanning");

//     const message: FaceSocketClientMessage =
//       {
//         type: "face.start",
//         action,
//         sessionId,
//       };

//     this.send(message);

//     if (websocketConfig.mode === "mock") {
//       this.startMock(action);
//     }
//   }

//   send(
//     message: FaceSocketClientMessage,
//   ) {
//     if (
//       websocketConfig.mode === "mock"
//     ) {
//       console.log(
//         "[Face WS MOCK]",
//         message.type,
//       );

//       return;
//     }

//     if (
//       !this.socket ||
//       this.socket.readyState !==
//         WebSocket.OPEN
//     ) {
//       throw new Error(
//         "WebSocket is not connected",
//       );
//     }

//     this.socket.send(
//       JSON.stringify(message),
//     );
//   }

//   sendFrame(frame: string) {
//     if (!this.sessionId) {
//       return;
//     }

//     const message: FaceSocketClientMessage =
//       {
//         type: "face.frame",
//         sessionId: this.sessionId,
//         frame,
//         timestamp: Date.now(),
//       };

//     this.send(message);
//   }

//   private startMock(
//     action: FaceAction,
//   ) {
//     this.mockTimer =
//       setTimeout(() => {
//         if (this.isStopped) {
//           return;
//         }

//         const sessionId =
//           this.sessionId!;

//         if (action === "register") {
//           this.messageHandler?.({
//             type: "face.registered",
//             sessionId,
//             employeeId:
//               "mock-employee-id",
//           });

//           this.setStatus("success");

//           return;
//         }

//         this.messageHandler?.({
//           type: "face.recognized",
//           sessionId,
//           employee: {
//             id: "mock-employee-id",
//             employeeCode: "EMP001",
//             fullName: "Nguyễn Văn A",
//           },
//           confidence: 0.97,
//         });

//         setTimeout(() => {
//           if (this.isStopped) {
//             return;
//           }

//           this.messageHandler?.({
//             type: "attendance.success",
//             sessionId,
//             action,
//             employee: {
//               id: "mock-employee-id",
//               fullName: "Nguyễn Văn A",
//             },
//             timestamp:
//               new Date().toISOString(),
//           });

//           this.setStatus("success");
//         }, 500);
//       }, 2000);
//   }

//   stop() {
//     this.isStopped = true;

//     if (this.mockTimer) {
//       clearTimeout(this.mockTimer);
//       this.mockTimer = null;
//     }

//     if (this.sessionId) {
//       try {
//         this.send({
//           type: "face.stop",
//           sessionId: this.sessionId,
//         });
//       } catch {
//         // ignore
//       }
//     }

//     this.sessionId = null;

//     if (this.socket) {
//       this.socket.close();
//       this.socket = null;
//     }

//     this.setStatus("closed");
//   }
// }