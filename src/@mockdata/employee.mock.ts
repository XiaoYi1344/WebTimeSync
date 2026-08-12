// src/mocks/employee.mock.ts

export type EmployeeStatus = 'active' | 'inactive' | 'on_leave';
export type AttendanceStatus =
  | 'present'
  | 'late'
  | 'early_leave'
  | 'absent'
  | 'leave'
  | 'late_early';

export type CorrectionStatus = 'pending' | 'approved' | 'rejected';
export type FaceStatus = 'registered' | 'not_registered' | 'expired';
export type FraudSeverity = 'low' | 'medium' | 'high' | 'critical';
export type FraudStatus = 'open' | 'reviewing' | 'resolved' | 'dismissed';

export interface Department {
  id: string;
  code: string;
  name: string;
  managerId: string | null;
  description: string;
  employeeCount: number;
  status: 'active' | 'inactive';
}

export interface Shift {
  id: string;
  code: string;
  name: string;
  startTime: string;
  endTime: string;
  breakStart: string | null;
  breakEnd: string | null;
  graceMinutes: number;
  workMinutes: number;
  status: 'active' | 'inactive';
}

export interface Employee {
  id: string;
  employeeCode: string;
  fullName: string;
  email: string;
  phone: string;
  avatar: string;
  gender: 'male' | 'female';
  dateOfBirth: string;
  departmentId: string;
  shiftId: string;
  position: string;
  status: EmployeeStatus;
  joinedAt: string;
  managerId: string | null;
  address: string;
}

export interface FaceRegistration {
  id: string;
  employeeId: string;
  status: FaceStatus;
  registeredAt: string | null;
  updatedAt: string | null;
  registeredBy: string | null;
  imageUrl: string | null;
  confidence: number | null;
  deviceId: string | null;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  shiftId: string;
  workDate: string;
  checkIn: string | null;
  checkOut: string | null;
  expectedCheckIn: string;
  expectedCheckOut: string;
  status: AttendanceStatus;
  lateMinutes: number;
  earlyLeaveMinutes: number;
  workedMinutes: number;
  checkInDeviceId: string | null;
  checkOutDeviceId: string | null;
  checkInMethod: 'face' | 'manual' | null;
  checkOutMethod: 'face' | 'manual' | null;
  note: string | null;
}

export interface CorrectionRequest {
  id: string;
  employeeId: string;
  attendanceId: string;
  requestType: 'missing_check_in' | 'missing_check_out' | 'wrong_time' | 'wrong_status';
  requestedCheckIn: string | null;
  requestedCheckOut: string | null;
  reason: string;
  status: CorrectionStatus;
  createdAt: string;
  reviewedAt: string | null;
  reviewedBy: string | null;
  reviewNote: string | null;
}

export interface Notification {
  id: string;
  employeeId: string | null;
  type:
    | 'attendance_success'
    | 'attendance_failed'
    | 'correction_updated'
    | 'face_updated'
    | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  referenceId: string | null;
}

export interface FraudCase {
  id: string;
  employeeId: string;
  attendanceId: string | null;
  type:
    | 'face_mismatch'
    | 'multiple_devices'
    | 'unusual_location'
    | 'duplicate_check_in'
    | 'suspicious_pattern';
  severity: FraudSeverity;
  status: FraudStatus;
  score: number;
  description: string;
  detectedAt: string;
  reviewedAt: string | null;
  reviewedBy: string | null;
}

export interface Device {
  id: string;
  name: string;
  code: string;
  location: string;
  type: 'face_terminal' | 'mobile' | 'web';
  status: 'online' | 'offline';
  lastSeenAt: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  type: 'annual' | 'sick' | 'unpaid' | 'personal';
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  approvedBy: string | null;
}

export interface ReportSummary {
  date: string;
  totalEmployees: number;
  present: number;
  late: number;
  earlyLeave: number;
  absent: number;
  leave: number;
  attendanceRate: number;
}

// -----------------------------------------------------------------------------
// Departments
// -----------------------------------------------------------------------------

export const departments: Department[] = [
  {
    id: 'dept-it',
    code: 'IT',
    name: 'Công nghệ thông tin',
    managerId: 'emp-001',
    description: 'Phát triển và vận hành hệ thống công nghệ.',
    employeeCount: 4,
    status: 'active',
  },
  {
    id: 'dept-hr',
    code: 'HR',
    name: 'Nhân sự',
    managerId: 'emp-005',
    description: 'Quản lý nhân sự, chấm công và chính sách nội bộ.',
    employeeCount: 2,
    status: 'active',
  },
  {
    id: 'dept-finance',
    code: 'FIN',
    name: 'Tài chính - Kế toán',
    managerId: 'emp-007',
    description: 'Quản lý tài chính và kế toán.',
    employeeCount: 2,
    status: 'active',
  },
  {
    id: 'dept-sales',
    code: 'SALES',
    name: 'Kinh doanh',
    managerId: 'emp-009',
    description: 'Phụ trách kinh doanh và chăm sóc khách hàng.',
    employeeCount: 2,
    status: 'active',
  },
  {
    id: 'dept-operations',
    code: 'OPS',
    name: 'Vận hành',
    managerId: 'emp-011',
    description: 'Vận hành văn phòng và hỗ trợ nội bộ.',
    employeeCount: 2,
    status: 'active',
  },
];

// -----------------------------------------------------------------------------
// Shifts
// -----------------------------------------------------------------------------

export const shifts: Shift[] = [
  {
    id: 'shift-office',
    code: 'HC',
    name: 'Hành chính',
    startTime: '08:00',
    endTime: '17:30',
    breakStart: '12:00',
    breakEnd: '13:30',
    graceMinutes: 10,
    workMinutes: 480,
    status: 'active',
  },
  {
    id: 'shift-morning',
    code: 'S1',
    name: 'Ca sáng',
    startTime: '06:00',
    endTime: '14:00',
    breakStart: '10:00',
    breakEnd: '10:30',
    graceMinutes: 10,
    workMinutes: 450,
    status: 'active',
  },
  {
    id: 'shift-afternoon',
    code: 'S2',
    name: 'Ca chiều',
    startTime: '14:00',
    endTime: '22:00',
    breakStart: '18:00',
    breakEnd: '18:30',
    graceMinutes: 10,
    workMinutes: 450,
    status: 'active',
  },
  {
    id: 'shift-flex',
    code: 'FLEX',
    name: 'Ca linh hoạt',
    startTime: '09:00',
    endTime: '18:00',
    breakStart: '12:00',
    breakEnd: '13:00',
    graceMinutes: 15,
    workMinutes: 480,
    status: 'active',
  },
];

// -----------------------------------------------------------------------------
// Employees
// -----------------------------------------------------------------------------

export const employees: Employee[] = [
  {
    id: 'emp-001',
    employeeCode: 'NV001',
    fullName: 'Nguyễn Minh Anh',
    email: 'minhanh@employee.vn',
    phone: '0901000001',
    avatar: 'https://i.pravatar.cc/150?img=47',
    gender: 'female',
    dateOfBirth: '1995-03-12',
    departmentId: 'dept-it',
    shiftId: 'shift-office',
    position: 'Trưởng phòng IT',
    status: 'active',
    joinedAt: '2022-05-10',
    managerId: null,
    address: 'TP. Hồ Chí Minh',
  },
  {
    id: 'emp-002',
    employeeCode: 'NV002',
    fullName: 'Trần Quốc Bảo',
    email: 'quocbao@employee.vn',
    phone: '0901000002',
    avatar: 'https://i.pravatar.cc/150?img=12',
    gender: 'male',
    dateOfBirth: '1998-07-21',
    departmentId: 'dept-it',
    shiftId: 'shift-office',
    position: 'Frontend Developer',
    status: 'active',
    joinedAt: '2024-01-15',
    managerId: 'emp-001',
    address: 'TP. Hồ Chí Minh',
  },
  {
    id: 'emp-003',
    employeeCode: 'NV003',
    fullName: 'Lê Hoàng Nam',
    email: 'hoangnam@employee.vn',
    phone: '0901000003',
    avatar: 'https://i.pravatar.cc/150?img=11',
    gender: 'male',
    dateOfBirth: '1997-11-08',
    departmentId: 'dept-it',
    shiftId: 'shift-office',
    position: 'Backend Developer',
    status: 'active',
    joinedAt: '2023-08-01',
    managerId: 'emp-001',
    address: 'TP. Hồ Chí Minh',
  },
  {
    id: 'emp-004',
    employeeCode: 'NV004',
    fullName: 'Phạm Ngọc Hân',
    email: 'ngochan@employee.vn',
    phone: '0901000004',
    avatar: 'https://i.pravatar.cc/150?img=32',
    gender: 'female',
    dateOfBirth: '1999-02-17',
    departmentId: 'dept-it',
    shiftId: 'shift-flex',
    position: 'UI/UX Designer',
    status: 'active',
    joinedAt: '2024-06-03',
    managerId: 'emp-001',
    address: 'TP. Hồ Chí Minh',
  },
  {
    id: 'emp-005',
    employeeCode: 'NV005',
    fullName: 'Đỗ Thanh Hà',
    email: 'thanhha@employee.vn',
    phone: '0901000005',
    avatar: 'https://i.pravatar.cc/150?img=44',
    gender: 'female',
    dateOfBirth: '1994-10-05',
    departmentId: 'dept-hr',
    shiftId: 'shift-office',
    position: 'Trưởng phòng Nhân sự',
    status: 'active',
    joinedAt: '2021-09-12',
    managerId: null,
    address: 'TP. Hồ Chí Minh',
  },
  {
    id: 'emp-006',
    employeeCode: 'NV006',
    fullName: 'Võ Thị Mai',
    email: 'thimai@employee.vn',
    phone: '0901000006',
    avatar: 'https://i.pravatar.cc/150?img=49',
    gender: 'female',
    dateOfBirth: '1998-04-23',
    departmentId: 'dept-hr',
    shiftId: 'shift-office',
    position: 'HR Executive',
    status: 'active',
    joinedAt: '2024-03-20',
    managerId: 'emp-005',
    address: 'TP. Hồ Chí Minh',
  },
  {
    id: 'emp-007',
    employeeCode: 'NV007',
    fullName: 'Nguyễn Đức Long',
    email: 'duclong@employee.vn',
    phone: '0901000007',
    avatar: 'https://i.pravatar.cc/150?img=68',
    gender: 'male',
    dateOfBirth: '1991-01-29',
    departmentId: 'dept-finance',
    shiftId: 'shift-office',
    position: 'Trưởng phòng Tài chính',
    status: 'active',
    joinedAt: '2020-04-15',
    managerId: null,
    address: 'TP. Hồ Chí Minh',
  },
  {
    id: 'emp-008',
    employeeCode: 'NV008',
    fullName: 'Nguyễn Thảo Vy',
    email: 'thaovy@employee.vn',
    phone: '0901000008',
    avatar: 'https://i.pravatar.cc/150?img=45',
    gender: 'female',
    dateOfBirth: '2000-09-14',
    departmentId: 'dept-finance',
    shiftId: 'shift-office',
    position: 'Kế toán viên',
    status: 'active',
    joinedAt: '2025-01-06',
    managerId: 'emp-007',
    address: 'TP. Hồ Chí Minh',
  },
  {
    id: 'emp-009',
    employeeCode: 'NV009',
    fullName: 'Phan Minh Tuấn',
    email: 'minhtuan@employee.vn',
    phone: '0901000009',
    avatar: 'https://i.pravatar.cc/150?img=13',
    gender: 'male',
    dateOfBirth: '1996-06-19',
    departmentId: 'dept-sales',
    shiftId: 'shift-flex',
    position: 'Trưởng phòng Kinh doanh',
    status: 'active',
    joinedAt: '2022-11-01',
    managerId: null,
    address: 'TP. Hồ Chí Minh',
  },
  {
    id: 'emp-010',
    employeeCode: 'NV010',
    fullName: 'Trương Mỹ Linh',
    email: 'mylinh@employee.vn',
    phone: '0901000010',
    avatar: 'https://i.pravatar.cc/150?img=48',
    gender: 'female',
    dateOfBirth: '2001-12-02',
    departmentId: 'dept-sales',
    shiftId: 'shift-flex',
    position: 'Sales Executive',
    status: 'active',
    joinedAt: '2025-02-17',
    managerId: 'emp-009',
    address: 'TP. Hồ Chí Minh',
  },
  {
    id: 'emp-011',
    employeeCode: 'NV011',
    fullName: 'Huỳnh Gia Huy',
    email: 'giahuy@employee.vn',
    phone: '0901000011',
    avatar: 'https://i.pravatar.cc/150?img=14',
    gender: 'male',
    dateOfBirth: '1993-05-30',
    departmentId: 'dept-operations',
    shiftId: 'shift-morning',
    position: 'Trưởng phòng Vận hành',
    status: 'active',
    joinedAt: '2021-02-01',
    managerId: null,
    address: 'TP. Hồ Chí Minh',
  },
  {
    id: 'emp-012',
    employeeCode: 'NV012',
    fullName: 'Nguyễn Khánh Linh',
    email: 'khanhlinh@employee.vn',
    phone: '0901000012',
    avatar: 'https://i.pravatar.cc/150?img=25',
    gender: 'female',
    dateOfBirth: '2000-08-25',
    departmentId: 'dept-operations',
    shiftId: 'shift-morning',
    position: 'Operations Executive',
    status: 'on_leave',
    joinedAt: '2024-09-10',
    managerId: 'emp-011',
    address: 'TP. Hồ Chí Minh',
  },
];

// -----------------------------------------------------------------------------
// Devices
// -----------------------------------------------------------------------------

export const devices: Device[] = [
  {
    id: 'device-main-gate',
    name: 'Máy chấm công cổng chính',
    code: 'FACE-001',
    location: 'Sảnh tầng 1',
    type: 'face_terminal',
    status: 'online',
    lastSeenAt: '2026-08-10T08:24:00+07:00',
  },
  {
    id: 'device-floor-2',
    name: 'Máy chấm công tầng 2',
    code: 'FACE-002',
    location: 'Tầng 2',
    type: 'face_terminal',
    status: 'online',
    lastSeenAt: '2026-08-10T08:22:00+07:00',
  },
  {
    id: 'device-mobile',
    name: 'Ứng dụng Mobile',
    code: 'MOBILE-001',
    location: 'Mobile',
    type: 'mobile',
    status: 'online',
    lastSeenAt: '2026-08-10T08:25:00+07:00',
  },
];

// -----------------------------------------------------------------------------
// Face registrations
// -----------------------------------------------------------------------------

export const faceRegistrations: FaceRegistration[] = [
  {
    id: 'face-001',
    employeeId: 'emp-001',
    status: 'registered',
    registeredAt: '2025-05-12T09:10:00+07:00',
    updatedAt: '2025-05-12T09:10:00+07:00',
    registeredBy: 'emp-001',
    imageUrl: 'https://i.pravatar.cc/300?img=47',
    confidence: 0.99,
    deviceId: 'device-main-gate',
  },
  {
    id: 'face-002',
    employeeId: 'emp-002',
    status: 'registered',
    registeredAt: '2025-02-20T10:00:00+07:00',
    updatedAt: '2025-02-20T10:00:00+07:00',
    registeredBy: 'emp-005',
    imageUrl: 'https://i.pravatar.cc/300?img=12',
    confidence: 0.98,
    deviceId: 'device-main-gate',
  },
  {
    id: 'face-003',
    employeeId: 'emp-003',
    status: 'registered',
    registeredAt: '2025-01-10T08:30:00+07:00',
    updatedAt: '2025-01-10T08:30:00+07:00',
    registeredBy: 'emp-005',
    imageUrl: 'https://i.pravatar.cc/300?img=11',
    confidence: 0.97,
    deviceId: 'device-floor-2',
  },
  {
    id: 'face-004',
    employeeId: 'emp-004',
    status: 'registered',
    registeredAt: '2025-07-01T14:20:00+07:00',
    updatedAt: '2025-07-01T14:20:00+07:00',
    registeredBy: 'emp-004',
    imageUrl: 'https://i.pravatar.cc/300?img=32',
    confidence: 0.99,
    deviceId: 'device-floor-2',
  },
  {
    id: 'face-005',
    employeeId: 'emp-005',
    status: 'registered',
    registeredAt: '2024-12-01T09:00:00+07:00',
    updatedAt: '2024-12-01T09:00:00+07:00',
    registeredBy: 'emp-005',
    imageUrl: 'https://i.pravatar.cc/300?img=44',
    confidence: 0.99,
    deviceId: 'device-main-gate',
  },
  {
    id: 'face-006',
    employeeId: 'emp-006',
    status: 'registered',
    registeredAt: '2025-03-25T11:00:00+07:00',
    updatedAt: '2025-03-25T11:00:00+07:00',
    registeredBy: 'emp-005',
    imageUrl: 'https://i.pravatar.cc/300?img=49',
    confidence: 0.96,
    deviceId: 'device-main-gate',
  },
  {
    id: 'face-007',
    employeeId: 'emp-007',
    status: 'registered',
    registeredAt: '2024-11-11T10:00:00+07:00',
    updatedAt: '2024-11-11T10:00:00+07:00',
    registeredBy: 'emp-005',
    imageUrl: 'https://i.pravatar.cc/300?img=68',
    confidence: 0.99,
    deviceId: 'device-main-gate',
  },
  {
    id: 'face-008',
    employeeId: 'emp-008',
    status: 'registered',
    registeredAt: '2025-02-01T13:00:00+07:00',
    updatedAt: '2025-02-01T13:00:00+07:00',
    registeredBy: 'emp-005',
    imageUrl: 'https://i.pravatar.cc/300?img=45',
    confidence: 0.98,
    deviceId: 'device-floor-2',
  },
  {
    id: 'face-009',
    employeeId: 'emp-009',
    status: 'registered',
    registeredAt: '2025-01-20T09:20:00+07:00',
    updatedAt: '2025-01-20T09:20:00+07:00',
    registeredBy: 'emp-005',
    imageUrl: 'https://i.pravatar.cc/300?img=13',
    confidence: 0.98,
    deviceId: 'device-main-gate',
  },
  {
    id: 'face-010',
    employeeId: 'emp-010',
    status: 'not_registered',
    registeredAt: null,
    updatedAt: null,
    registeredBy: null,
    imageUrl: null,
    confidence: null,
    deviceId: null,
  },
  {
    id: 'face-011',
    employeeId: 'emp-011',
    status: 'registered',
    registeredAt: '2024-10-15T08:00:00+07:00',
    updatedAt: '2024-10-15T08:00:00+07:00',
    registeredBy: 'emp-005',
    imageUrl: 'https://i.pravatar.cc/300?img=14',
    confidence: 0.99,
    deviceId: 'device-main-gate',
  },
  {
    id: 'face-012',
    employeeId: 'emp-012',
    status: 'registered',
    registeredAt: '2025-03-01T10:30:00+07:00',
    updatedAt: '2025-03-01T10:30:00+07:00',
    registeredBy: 'emp-005',
    imageUrl: 'https://i.pravatar.cc/300?img=25',
    confidence: 0.97,
    deviceId: 'device-main-gate',
  },
];

// -----------------------------------------------------------------------------
// Attendance - data covers several days and references real employees/shifts.
// -----------------------------------------------------------------------------

const attendance: AttendanceRecord[] = [];

function addAttendance(
  id: string,
  employeeId: string,
  workDate: string,
  checkIn: string | null,
  checkOut: string | null,
  status: AttendanceStatus,
  lateMinutes = 0,
  earlyLeaveMinutes = 0,
  workedMinutes = 0,
  note: string | null = null,
  checkInDeviceId: string | null = 'device-main-gate',
  checkOutDeviceId: string | null = 'device-main-gate',
) {
  const employee = employees.find((e) => e.id === employeeId)!;
  const shift = shifts.find((s) => s.id === employee.shiftId)!;

  attendance.push({
    id,
    employeeId,
    shiftId: shift.id,
    workDate,
    checkIn,
    checkOut,
    expectedCheckIn: `${workDate}T${shift.startTime}:00+07:00`,
    expectedCheckOut: `${workDate}T${shift.endTime}:00+07:00`,
    status,
    lateMinutes,
    earlyLeaveMinutes,
    workedMinutes,
    checkInDeviceId,
    checkOutDeviceId,
    checkInMethod: checkIn ? 'face' : null,
    checkOutMethod: checkOut ? 'face' : null,
    note,
  });
}

// 2026-08-10
addAttendance('att-001', 'emp-001', '2026-08-10', '2026-08-10T07:52:00+07:00', '2026-08-10T17:34:00+07:00', 'present', 0, 0, 482);
addAttendance('att-002', 'emp-002', '2026-08-10', '2026-08-10T08:04:00+07:00', null, 'present', 0, 0, 0);
addAttendance('att-003', 'emp-003', '2026-08-10', '2026-08-10T08:17:00+07:00', '2026-08-10T17:30:00+07:00', 'late', 17, 0, 453);
addAttendance('att-004', 'emp-004', '2026-08-10', '2026-08-10T09:01:00+07:00', '2026-08-10T18:03:00+07:00', 'present', 1, 0, 482);
addAttendance('att-005', 'emp-005', '2026-08-10', '2026-08-10T07:55:00+07:00', '2026-08-10T17:28:00+07:00', 'present', 0, 2, 478);
addAttendance('att-006', 'emp-006', '2026-08-10', '2026-08-10T08:00:00+07:00', '2026-08-10T17:30:00+07:00', 'present', 0, 0, 480);
addAttendance('att-007', 'emp-007', '2026-08-10', '2026-08-10T08:06:00+07:00', '2026-08-10T17:30:00+07:00', 'present', 0, 0, 480);
addAttendance('att-008', 'emp-008', '2026-08-10', '2026-08-10T08:03:00+07:00', '2026-08-10T17:25:00+07:00', 'early_leave', 0, 5, 475);
addAttendance('att-009', 'emp-009', '2026-08-10', '2026-08-10T09:20:00+07:00', null, 'late', 20, 0, 0);
addAttendance('att-010', 'emp-010', '2026-08-10', null, null, 'absent', 0, 0, 0, 'Chưa có dữ liệu chấm công');
addAttendance('att-011', 'emp-011', '2026-08-10', '2026-08-10T05:55:00+07:00', '2026-08-10T14:05:00+07:00', 'present', 0, 0, 450);
addAttendance('att-012', 'emp-012', '2026-08-10', null, null, 'leave', 0, 0, 0, 'Nghỉ phép đã được duyệt');

// 2026-08-07
addAttendance('att-013', 'emp-001', '2026-08-07', '2026-08-07T07:58:00+07:00', '2026-08-07T17:30:00+07:00', 'present', 0, 0, 480);
addAttendance('att-014', 'emp-002', '2026-08-07', '2026-08-07T08:20:00+07:00', '2026-08-07T17:30:00+07:00', 'late', 20, 0, 460);
addAttendance('att-015', 'emp-003', '2026-08-07', '2026-08-07T07:59:00+07:00', '2026-08-07T17:30:00+07:00', 'present', 0, 0, 480);
addAttendance('att-016', 'emp-004', '2026-08-07', '2026-08-07T09:00:00+07:00', '2026-08-07T17:50:00+07:00', 'present', 0, 0, 480);
addAttendance('att-017', 'emp-005', '2026-08-07', '2026-08-07T07:57:00+07:00', '2026-08-07T17:30:00+07:00', 'present', 0, 0, 480);
addAttendance('att-018', 'emp-006', '2026-08-07', '2026-08-07T08:12:00+07:00', '2026-08-07T17:30:00+07:00', 'late', 12, 0, 468);
addAttendance('att-019', 'emp-007', '2026-08-07', '2026-08-07T07:56:00+07:00', '2026-08-07T17:30:00+07:00', 'present', 0, 0, 480);
addAttendance('att-020', 'emp-008', '2026-08-07', '2026-08-07T08:02:00+07:00', '2026-08-07T17:30:00+07:00', 'present', 0, 0, 480);
addAttendance('att-021', 'emp-009', '2026-08-07', '2026-08-07T09:00:00+07:00', '2026-08-07T17:45:00+07:00', 'present', 0, 0, 480);
addAttendance('att-022', 'emp-010', '2026-08-07', '2026-08-07T09:08:00+07:00', '2026-08-07T18:00:00+07:00', 'present', 8, 0, 472);
addAttendance('att-023', 'emp-011', '2026-08-07', '2026-08-07T05:58:00+07:00', '2026-08-07T14:00:00+07:00', 'present', 0, 0, 450);
addAttendance('att-024', 'emp-012', '2026-08-07', null, null, 'leave', 0, 0, 0, 'Nghỉ phép');

// 2026-08-06
addAttendance('att-025', 'emp-001', '2026-08-06', '2026-08-06T08:00:00+07:00', '2026-08-06T17:30:00+07:00', 'present', 0, 0, 480);
addAttendance('att-026', 'emp-002', '2026-08-06', '2026-08-06T07:55:00+07:00', '2026-08-06T17:30:00+07:00', 'present', 0, 0, 480);
addAttendance('att-027', 'emp-003', '2026-08-06', '2026-08-06T08:05:00+07:00', '2026-08-06T17:25:00+07:00', 'early_leave', 0, 5, 475);
addAttendance('att-028', 'emp-004', '2026-08-06', '2026-08-06T09:00:00+07:00', '2026-08-06T18:00:00+07:00', 'present', 0, 0, 480);
addAttendance('att-029', 'emp-005', '2026-08-06', '2026-08-06T08:14:00+07:00', '2026-08-06T17:30:00+07:00', 'late', 14, 0, 466);
addAttendance('att-030', 'emp-006', '2026-08-06', '2026-08-06T07:59:00+07:00', '2026-08-06T17:30:00+07:00', 'present', 0, 0, 480);
addAttendance('att-031', 'emp-007', '2026-08-06', '2026-08-06T08:00:00+07:00', '2026-08-06T17:30:00+07:00', 'present', 0, 0, 480);
addAttendance('att-032', 'emp-008', '2026-08-06', '2026-08-06T08:00:00+07:00', '2026-08-06T17:30:00+07:00', 'present', 0, 0, 480);
addAttendance('att-033', 'emp-009', '2026-08-06', '2026-08-06T09:00:00+07:00', '2026-08-06T18:00:00+07:00', 'present', 0, 0, 480);
addAttendance('att-034', 'emp-010', '2026-08-06', '2026-08-06T09:30:00+07:00', '2026-08-06T18:00:00+07:00', 'late', 30, 0, 450);
addAttendance('att-035', 'emp-011', '2026-08-06', '2026-08-06T06:00:00+07:00', '2026-08-06T14:00:00+07:00', 'present', 0, 0, 450);
addAttendance('att-036', 'emp-012', '2026-08-06', null, null, 'leave', 0, 0, 0, 'Nghỉ phép');

export const attendanceRecords = attendance;

// -----------------------------------------------------------------------------
// Correction requests
// -----------------------------------------------------------------------------

export const correctionRequests: CorrectionRequest[] = [
  {
    id: 'correction-001',
    employeeId: 'emp-003',
    attendanceId: 'att-003',
    requestType: 'wrong_time',
    requestedCheckIn: '2026-08-10T08:05:00+07:00',
    requestedCheckOut: null,
    reason: 'Máy chấm công nhận diện khuôn mặt chậm. Tôi đã có mặt lúc 08:05.',
    status: 'pending',
    createdAt: '2026-08-10T08:30:00+07:00',
    reviewedAt: null,
    reviewedBy: null,
    reviewNote: null,
  },
  {
    id: 'correction-002',
    employeeId: 'emp-002',
    attendanceId: 'att-014',
    requestType: 'wrong_time',
    requestedCheckIn: '2026-08-07T08:05:00+07:00',
    requestedCheckOut: null,
    reason: 'Thời gian chấm công bị ghi nhận trễ hơn thực tế.',
    status: 'approved',
    createdAt: '2026-08-07T10:00:00+07:00',
    reviewedAt: '2026-08-07T11:30:00+07:00',
    reviewedBy: 'emp-005',
    reviewNote: 'Đã kiểm tra camera và xác nhận.',
  },
  {
    id: 'correction-003',
    employeeId: 'emp-008',
    attendanceId: 'att-008',
    requestType: 'missing_check_out',
    requestedCheckIn: null,
    requestedCheckOut: '2026-08-10T17:30:00+07:00',
    reason: 'Quên thao tác chấm công khi ra về.',
    status: 'pending',
    createdAt: '2026-08-10T18:00:00+07:00',
    reviewedAt: null,
    reviewedBy: null,
    reviewNote: null,
  },
  {
    id: 'correction-004',
    employeeId: 'emp-010',
    attendanceId: 'att-034',
    requestType: 'wrong_status',
    requestedCheckIn: '2026-08-06T09:00:00+07:00',
    requestedCheckOut: '2026-08-06T18:00:00+07:00',
    reason: 'Có mặt tại văn phòng từ 09:00 nhưng nhận diện thất bại.',
    status: 'rejected',
    createdAt: '2026-08-06T19:00:00+07:00',
    reviewedAt: '2026-08-07T09:00:00+07:00',
    reviewedBy: 'emp-005',
    reviewNote: 'Không tìm thấy dữ liệu camera xác nhận.',
  },
];

// -----------------------------------------------------------------------------
// Notifications
// -----------------------------------------------------------------------------

export const notifications: Notification[] = [
  {
    id: 'noti-001',
    employeeId: 'emp-002',
    type: 'attendance_success',
    title: 'Chấm công thành công',
    message: 'Bạn đã chấm công vào lúc 08:04 ngày 10/08/2026.',
    read: false,
    createdAt: '2026-08-10T08:04:30+07:00',
    referenceId: 'att-002',
  },
  {
    id: 'noti-002',
    employeeId: 'emp-003',
    type: 'attendance_success',
    title: 'Chấm công trễ',
    message: 'Hệ thống ghi nhận bạn chấm công trễ 17 phút.',
    read: false,
    createdAt: '2026-08-10T08:17:30+07:00',
    referenceId: 'att-003',
  },
  {
    id: 'noti-003',
    employeeId: 'emp-003',
    type: 'correction_updated',
    title: 'Yêu cầu chỉnh công đang chờ duyệt',
    message: 'Yêu cầu chỉnh công của bạn đã được gửi đến quản trị viên.',
    read: true,
    createdAt: '2026-08-10T08:31:00+07:00',
    referenceId: 'correction-001',
  },
  {
    id: 'noti-004',
    employeeId: 'emp-002',
    type: 'correction_updated',
    title: 'Yêu cầu chỉnh công được duyệt',
    message: 'Yêu cầu chỉnh công ngày 07/08/2026 đã được duyệt.',
    read: true,
    createdAt: '2026-08-07T11:31:00+07:00',
    referenceId: 'correction-002',
  },
  {
    id: 'noti-005',
    employeeId: 'emp-010',
    type: 'attendance_failed',
    title: 'Chấm công không thành công',
    message: 'Không thể xác thực khuôn mặt. Vui lòng thử lại.',
    read: false,
    createdAt: '2026-08-06T09:00:30+07:00',
    referenceId: 'att-034',
  },
  {
    id: 'noti-006',
    employeeId: null,
    type: 'system',
    title: 'Có yêu cầu chỉnh công mới',
    message: 'Hệ thống có 2 yêu cầu chỉnh công đang chờ xử lý.',
    read: false,
    createdAt: '2026-08-10T18:01:00+07:00',
    referenceId: 'correction-003',
  },
];

// -----------------------------------------------------------------------------
// Fraud / suspicious cases
// -----------------------------------------------------------------------------

export const fraudCases: FraudCase[] = [
  {
    id: 'fraud-001',
    employeeId: 'emp-010',
    attendanceId: 'att-034',
    type: 'face_mismatch',
    severity: 'high',
    status: 'reviewing',
    score: 87,
    description: 'Khuôn mặt được nhận diện có độ tương đồng thấp hơn ngưỡng cho phép.',
    detectedAt: '2026-08-06T09:00:25+07:00',
    reviewedAt: '2026-08-07T09:15:00+07:00',
    reviewedBy: 'emp-005',
  },
  {
    id: 'fraud-002',
    employeeId: 'emp-009',
    attendanceId: 'att-009',
    type: 'multiple_devices',
    severity: 'medium',
    status: 'open',
    score: 62,
    description: 'Tài khoản được sử dụng để chấm công từ nhiều thiết bị trong thời gian ngắn.',
    detectedAt: '2026-08-10T09:21:00+07:00',
    reviewedAt: null,
    reviewedBy: null,
  },
  {
    id: 'fraud-003',
    employeeId: 'emp-002',
    attendanceId: 'att-014',
    type: 'unusual_location',
    severity: 'low',
    status: 'dismissed',
    score: 31,
    description: 'Vị trí chấm công khác với vị trí văn phòng đã đăng ký.',
    detectedAt: '2026-08-07T08:20:30+07:00',
    reviewedAt: '2026-08-07T12:00:00+07:00',
    reviewedBy: 'emp-005',
  },
];

// -----------------------------------------------------------------------------
// Leave requests
// -----------------------------------------------------------------------------

export const leaveRequests: LeaveRequest[] = [
  {
    id: 'leave-001',
    employeeId: 'emp-012',
    type: 'annual',
    startDate: '2026-08-06',
    endDate: '2026-08-10',
    totalDays: 3,
    reason: 'Nghỉ phép cá nhân.',
    status: 'approved',
    createdAt: '2026-08-01T09:00:00+07:00',
    approvedBy: 'emp-005',
  },
  {
    id: 'leave-002',
    employeeId: 'emp-010',
    type: 'personal',
    startDate: '2026-08-14',
    endDate: '2026-08-14',
    totalDays: 1,
    reason: 'Có việc cá nhân.',
    status: 'pending',
    createdAt: '2026-08-08T15:00:00+07:00',
    approvedBy: null,
  },
];

// -----------------------------------------------------------------------------
// Dashboard reports
// -----------------------------------------------------------------------------

export const reportSummaries: ReportSummary[] = [
  {
    date: '2026-08-10',
    totalEmployees: 12,
    present: 5,
    late: 2,
    earlyLeave: 1,
    absent: 1,
    leave: 1,
    attendanceRate: 75,
  },
  {
    date: '2026-08-07',
    totalEmployees: 12,
    present: 8,
    late: 3,
    earlyLeave: 0,
    absent: 0,
    leave: 1,
    attendanceRate: 91.67,
  },
  {
    date: '2026-08-06',
    totalEmployees: 12,
    present: 7,
    late: 2,
    earlyLeave: 1,
    absent: 0,
    leave: 1,
    attendanceRate: 91.67,
  },
];

// -----------------------------------------------------------------------------
// Relation helpers
// -----------------------------------------------------------------------------

export const getEmployeeById = (id: string) =>
  employees.find((employee) => employee.id === id);

export const getDepartmentById = (id: string) =>
  departments.find((department) => department.id === id);

export const getShiftById = (id: string) =>
  shifts.find((shift) => shift.id === id);

export const getFaceByEmployeeId = (employeeId: string) =>
  faceRegistrations.find((face) => face.employeeId === employeeId);

export const getAttendanceByEmployeeId = (employeeId: string) =>
  attendanceRecords.filter((record) => record.employeeId === employeeId);

export const getAttendanceByDate = (date: string) =>
  attendanceRecords.filter((record) => record.workDate === date);

export const getCorrectionByEmployeeId = (employeeId: string) =>
  correctionRequests.filter((request) => request.employeeId === employeeId);

export const getNotificationsByEmployeeId = (employeeId: string) =>
  notifications.filter(
    (notification) =>
      notification.employeeId === employeeId || notification.employeeId === null,
  );

export const getFraudByEmployeeId = (employeeId: string) =>
  fraudCases.filter((fraud) => fraud.employeeId === employeeId);

export const getLeaveRequestsByEmployeeId = (employeeId: string) =>
  leaveRequests.filter((request) => request.employeeId === employeeId);

// Joined employee object for tables/details.
export const getEmployeeDetail = (employeeId: string) => {
  const employee = getEmployeeById(employeeId);
  if (!employee) return null;

  return {
    employee,
    department: getDepartmentById(employee.departmentId) ?? null,
    shift: getShiftById(employee.shiftId) ?? null,
    face: getFaceByEmployeeId(employee.id) ?? null,
    attendance: getAttendanceByEmployeeId(employee.id),
    corrections: getCorrectionByEmployeeId(employee.id),
    notifications: getNotificationsByEmployeeId(employee.id),
    fraudCases: getFraudByEmployeeId(employee.id),
    leaveRequests: getLeaveRequestsByEmployeeId(employee.id),
  };
};

// Dashboard stats generated from the same source data.
export const getDashboardStats = (date = '2026-08-10') => {
  const records = getAttendanceByDate(date);

  return {
    totalEmployees: employees.length,
    activeEmployees: employees.filter((e) => e.status === 'active').length,
    present: records.filter(
      (r) => r.status === 'present' || r.status === 'early_leave',
    ).length,
    late: records.filter(
      (r) => r.status === 'late' || r.status === 'late_early',
    ).length,
    earlyLeave: records.filter(
      (r) => r.status === 'early_leave' || r.status === 'late_early',
    ).length,
    absent: records.filter((r) => r.status === 'absent').length,
    leave: records.filter((r) => r.status === 'leave').length,
    pendingCorrections: correctionRequests.filter(
      (r) => r.status === 'pending',
    ).length,
    openFraudCases: fraudCases.filter(
      (r) => r.status === 'open' || r.status === 'reviewing',
    ).length,
    faceRegistered: faceRegistrations.filter(
      (r) => r.status === 'registered',
    ).length,
    faceNotRegistered: faceRegistrations.filter(
      (r) => r.status === 'not_registered',
    ).length,
  };
};

// Joined rows for admin employee table.
export const employeeTableData = employees.map((employee) => {
  const department = getDepartmentById(employee.departmentId);
  const shift = getShiftById(employee.shiftId);
  const face = getFaceByEmployeeId(employee.id);
  const today = getAttendanceByDate('2026-08-10').find(
    (record) => record.employeeId === employee.id,
  );

  return {
    ...employee,
    departmentName: department?.name ?? '—',
    shiftName: shift?.name ?? '—',
    faceStatus: face?.status ?? 'not_registered',
    todayAttendance: today ?? null,
  };
});

// Admin sidebar badge counts can also come from the same data.
export const adminBadges = {
  pendingCorrections: correctionRequests.filter(
    (r) => r.status === 'pending',
  ).length,
  suspiciousCases: fraudCases.filter(
    (r) => r.status === 'open' || r.status === 'reviewing',
  ).length,
  unregisteredFaces: faceRegistrations.filter(
    (r) => r.status === 'not_registered',
  ).length,
  pendingLeaveRequests: leaveRequests.filter((r) => r.status === 'pending')
    .length,
};
