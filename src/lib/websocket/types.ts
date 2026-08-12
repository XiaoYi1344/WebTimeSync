// export type FaceAction = "check_in" | "check_out" | "register";

// export type FaceSocketStatus =
//   | "idle"
//   | "connecting"
//   | "connected"
//   | "scanning"
//   | "success"
//   | "error"
//   | "closed";

// export type FaceSocketClientMessage =
//   | {
//       type: "face.start";
//       action: FaceAction;
//       sessionId: string;
//     }
//   | {
//       type: "face.frame";
//       sessionId: string;
//       frame: string;
//       timestamp: number;
//     }
//   | {
//       type: "face.stop";
//       sessionId: string;
//     };

// export type FaceSocketServerMessage =
//   | {
//       type: "face.ready";
//       sessionId: string;
//     }
//   | {
//       type: "face.processing";
//       sessionId: string;
//     }
//   | {
//       type: "face.detected";
//       sessionId: string;
//       confidence?: number;
//     }
//   | {
//       type: "face.recognized";
//       sessionId: string;
//       employee: {
//         id: string;
//         employeeCode?: string;
//         fullName: string;
//       };
//       confidence: number;
//     }
//   | {
//       type: "face.registered";
//       sessionId: string;
//       employeeId: string;
//     }
//   | {
//       type: "attendance.success";
//       sessionId: string;
//       action: "check_in" | "check_out";
//       employee: {
//         id: string;
//         fullName: string;
//       };
//       timestamp: string;
//     }
//   | {
//       type: "face.error";
//       sessionId: string;
//       code: string;
//       message: string;
//     };