// import {
//   useCallback,
//   useEffect,
//   useRef,
//   useState,
// } from "react";

// import {
//   FaceWebSocket,
// } from "@/lib/websocket/face-socket";

// import {
//   captureVideoFrame,
// } from "@/lib/websocket/frame-capture";

// import {
//   websocketConfig,
// } from "@/lib/websocket/config";

// import type {
//   FaceAction,
//   FaceSocketServerMessage,
//   FaceSocketStatus,
// } from "@/lib/websocket/types";

// export function useFaceWebSocket() {
//   const socketRef =
//     useRef<FaceWebSocket | null>(null);

//   const frameTimerRef =
//     useRef<ReturnType<
//       typeof setInterval
//     > | null>(null);

//   const videoRef =
//     useRef<HTMLVideoElement | null>(null);

//   const [status, setStatus] =
//     useState<FaceSocketStatus>("idle");

//   const [lastMessage, setLastMessage] =
//     useState<FaceSocketServerMessage | null>(
//       null,
//     );

//   useEffect(() => {
//     const socket =
//       new FaceWebSocket();

//     socketRef.current = socket;

//     const unsubscribeMessage =
//       socket.onMessage((message) => {
//         setLastMessage(message);
//       });

//     const unsubscribeStatus =
//       socket.onStatus(setStatus);

//     return () => {
//       unsubscribeMessage();
//       unsubscribeStatus();

//       socket.stop();

//       socketRef.current = null;
//     };
//   }, []);

//   const start = useCallback(
//     async (
//       video: HTMLVideoElement,
//       action: FaceAction,
//     ) => {
//       videoRef.current = video;

//       const sessionId =
//         crypto.randomUUID();

//       await socketRef.current?.start({
//         action,
//         sessionId,
//       });

//       /**
//        * Hiện tại MOCK không cần frame.
//        *
//        * Nhưng code capture frame đã sẵn sàng.
//        */
//       frameTimerRef.current =
//         setInterval(async () => {
//           const currentVideo =
//             videoRef.current;

//           if (!currentVideo) {
//             return;
//           }

//           const frame =
//             await captureVideoFrame(
//               currentVideo,
//               {
//                 width:
//                   websocketConfig.frameWidth,

//                 quality:
//                   websocketConfig.imageQuality,
//               },
//             );

//           if (!frame) {
//             return;
//           }

//           socketRef.current?.sendFrame(
//             frame,
//           );
//         }, websocketConfig.frameInterval);
//     },
//     [],
//   );

//   const stop = useCallback(() => {
//     if (frameTimerRef.current) {
//       clearInterval(
//         frameTimerRef.current,
//       );

//       frameTimerRef.current = null;
//     }

//     socketRef.current?.stop();

//     videoRef.current = null;
//   }, []);

//   return {
//     status,
//     lastMessage,
//     start,
//     stop,
//   };
// }