// export const websocketConfig = {
//   /**
//    * Sau này chỉ cần thay biến môi trường.
//    *
//    * NEXT_PUBLIC_WS_URL=
//    * wss://api.example.com/ws
//    */

//   url:
//     process.env.NEXT_PUBLIC_WS_URL ||
//     "ws://localhost:8000/ws/face",

//   /**
//    * MOCK = chưa có backend
//    * REAL = backend đã sẵn sàng
//    */
//   mode:
//     process.env.NEXT_PUBLIC_FACE_WS_MODE === "real"
//       ? "real"
//       : "mock",

//   frameInterval: 150,

//   /**
//    * JPEG quality
//    */
//   imageQuality: 0.75,

//   /**
//    * resize frame trước khi gửi
//    */
//   frameWidth: 640,
// };