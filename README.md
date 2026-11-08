# Parental Control System -- API Development Checklist

## 📌 Project Overview

This repository tracks the backend API development progress for the **Parental Control System**.

- **Total Planned Endpoints:** 33+
- **Completed APIs:** 32
- **Backend Stack:** Node.js, Express.js, Prisma, PostgreSQL

---

## 🚀 API Status & Endpoints

### 0. Health API (`/api/health`)

- [ ] **#0 Health Check** --- `GET /api/health`

### 1. Authentication API (`/api/auth`)

- [x] **#1 Parent Registration** --- `POST /api/auth/register`
- [x] **#2 User Login** --- `POST /api/auth/login`
- [x] **#3 Refresh Token Rotation** --- `POST /api/auth/refresh`
- [x] **#4 User Logout** --- `POST /api/auth/logout`

### 2. Device Pairing API (`/api/device-pairing`)

- [x] **#5 Generate Pairing Code** --- `POST /api/device-pairing/generate`
- [x] **#6 Complete Device Pairing** --- `POST /api/device-pairing/complete`

### 3. Device Heartbeat API (`/api/device-heartbeat`)

- [x] **#7 Device Heartbeat** --- `POST /api/device-heartbeat`

### 4. Device Token Management API (`/api/device-refresh`, `/api/device-logout`)

- [x] **#8 Device Refresh Token** --- `POST /api/device-refresh`
- [x] **#9 Device Logout** --- `POST /api/device-logout`

### 5. Device Management API (`/api/devices`)

- [x] **#10 Get All Child Devices** --- `GET /api/devices`
- [x] **#11 Get Device Details** --- `GET /api/devices/:deviceId`
- [x] **#12 Update Device Status** --- `PATCH /api/devices/:deviceId/status`
- [x] **#13 Remove Device** --- `DELETE /api/devices/:deviceId`

> **Note:** "Remove Device" is implemented as a soft removal by setting the device status to `REMOVED`.

#### Supported Device Statuses

`ACTIVE` | `OFFLINE` | `LOCKED` | `PAUSED` | `REMOVED`

### 6. Permission Management API (`/api/devices`, `/api/device`)

- [x] **#14 Get Device Permissions** --- `GET /api/devices/:deviceId/permissions`
- [x] **#15 Update Device Permission** --- `PATCH /api/devices/:deviceId/permissions/:permissionId`
- [x] **#16 Child Permission Request** --- `POST /api/device/permission-requests`
- [x] **#17 Parent Get Permission Requests** --- `GET /api/device/permission-requests`
- [x] **#18 Approve Permission Request** --- `PATCH /api/device/permission-requests/:requestId/approve`
- [x] **#19 Reject Permission Request** --- `PATCH /api/device/permission-requests/:requestId/reject`
- [x] **#20 Child View Own Permission Requests** --- `GET /api/device/my-permission-requests`

#### Constants & Types

- **Permission Types:** `CAMERA`, `MICROPHONE`, `LOCATION`, `STORAGE`, `CONTACTS`, `NOTIFICATIONS`, `OTHER`
- **Request Types:** `HARDWARE_PERMISSION`, `APPLICATION_ACCESS`, `DOMAIN_ACCESS`
- **Permission Request Statuses:** `PENDING`, `APPROVED`, `DENIED`, `EXPIRED`

### 7. Screen Time Management API (`/api/devices`)

- [x] **#21 Get Screen Time Policy** --- `GET /api/devices/:deviceId/screen-time-policy`
- [x] **#22 Create Screen Time Policy** --- `POST /api/devices/:deviceId/screen-time-policy`
- [x] **#23 Update Screen Time Policy** --- `PATCH /api/devices/:deviceId/screen-time-policy`
- [x] **#24 Get Per-App Limits** --- `GET /api/devices/:deviceId/app-limits`
- [x] **#25 Create Per-App Limit** --- `POST /api/devices/:deviceId/app-limits`
- [x] **#26 Update Per-App Limit** --- `PATCH /api/devices/:deviceId/app-limits/:limitId`
- [x] **#27 Delete Per-App Limit** --- `DELETE /api/devices/:deviceId/app-limits/:limitId`

### 8. App Usage Monitoring API

- [x] **#28 Record App Usage** --- `POST /api/device/app-usage`
- [x] **#29 Get Device App Usage** --- `GET /api/devices/:deviceId/app-usage`
- [x] **#30 Get App Usage Summary** --- `GET /api/devices/:deviceId/app-usage/summary`

### 9. Device Activity API

- [x] **#31 Record Device Activity** --- `POST /api/device/activity`
- [x] **#32 Get Device Activity Logs** --- `GET /api/devices/:deviceId/activity`

### 10. Remote Device Control API

- [x] **#33 Create Remote Command** --- `POST /api/devices/:deviceId/commands`
- [x] **#34 Get Pending Commands** --- `GET /api/device/commands`
- [x] **#35 Update Command Status** --- `PATCH /api/device/commands/:commandId/status`
- [x] **#36 Get Device Command History** --- `GET /api/devices/:deviceId/commands`

### 11. DNS Policy & Domain Rules

- [x] **#37 Create DNS Policy** --- `POST /api/devices/:deviceId/dns-policy`
- [x] **#38 Get DNS Policy** --- `GET /api/devices/:deviceId/dns-policy`
- [x] **#39 Update DNS Policy** --- `PATCH /api/devices/:deviceId/dns-policy`
- [x] **#40 Add Domain Rule** --- `POST /api/devices/:deviceId/dns-policy/domain-rules`
- [x] **#41 Get Domain Rules** --- `GET /api/devices/:deviceId/dns-policy/domain-rules`
- [x] **#42 Update Domain Rule** --- `PATCH /api/devices/:deviceId/dns-policy/domain-rules/:ruleId`
- [x] **#43 Delete Domain Rule** --- `DELETE /api/devices/:deviceId/dns-policy/domain-rules/:ruleId`

### 12. Domain Category Management API

- [x] **#40 Create Category** --- `POST /api/domain-categories`
- [x] **#41 Get All Categories** --- `GET /api/domain-categories`
- [x] **#42 Get Single Category** --- `GET /api/domain-categories/:categoryId`
- [x] **#43 Update Category** --- `PATCH /api/domain-categories/:categoryId`
- [x] **#44 Delete Category** --- `DELETE /api/domain-categories/:categoryId`

### 13. Browser Policy Management API

- [x] **#45 Save Browsing History from Child Device** --- `POST /api/device/browser-history`
- [x] **#46 View Child's Browsing History** --- `GET /api/devices/:deviceId/browser-history`

## 📊 Backend API Development Progress

## 📈 Overall Summary

- **Total Completed Endpoints:** 46
- **Current Status:** 13 Categories Completed, 6 Categories Pending

---

## 📋 Endpoint Breakdown

| Category                            | Total Endpoints | Completed |      Status      |
| :---------------------------------- | :-------------: | :-------: | :--------------: |
| **Health Check**                    |        1        |     1     |   ✅ Completed   |
| **Authentication**                  |        4        |     4     |   ✅ Completed   |
| **Device Pairing**                  |        2        |     2     |   ✅ Completed   |
| **Device Heartbeat**                |        1        |     1     |   ✅ Completed   |
| **Device Token Management**         |        2        |     2     |   ✅ Completed   |
| **Device Management**               |        4        |     4     |   ✅ Completed   |
| **Permission Management**           |        7        |     7     |   ✅ Completed   |
| **Screen Time Management**          |        7        |     7     |   ✅ Completed   |
| **App Usage Tracking**              |        3        |     3     |   ✅ Completed   |
| **Device Activity Monitoring**      |        2        |     3     |   ✅ Completed   |
| **Remote Device Control**           |        4        |     4     |   ✅ Completed   |
| **Website & Domain Filtering**      |        7        |    12     |   ✅ Completed   |
| **Browser Activity / History**      |        5        |     2     |   ✅ Completed   |
| **Application Management**          |        2        |     —     |    ⬜ Pending    |
| **Location Tracking**               |        —        |     —     |    ⬜ Pending    |
| **Alert & Notification Management** |        —        |     —     |    ⬜ Pending    |
| **Policy Management**               |        —        |     —     |    ⬜ Pending    |
| **Chat & Live Agent**               |        —        |     —     |    ⬜ Pending    |
| **Security & Tamper Detection**     |        —        |     —     |    ⬜ Pending    |
| **Total Completed**                 |     **52**      |  **52**   | **✅ Completed** |

---

> ℹ️ **Note:** Endpoint counts for pending categories will be determined after verifying the Prisma schema and project requirements.

## ⚠️ Important Implementation Notes

1. **Authentication:** Parent-only endpoints must use Parent authentication and authorization.
2. **Device Scope:** Child-device endpoints must use device authentication.
3. **Permission Scoping:** Permission request access must be scoped to the authenticated Parent's children or the authenticated Child Device.
4. **Hardware Permission Sync:** Approving a `HARDWARE_PERMISSION` request updates the corresponding `DevicePermission` record in the database within a transaction.
5. **OS Enforcement Notice:** A database permission update alone does **not** grant or enforce the permission at the operating-system level. Child App policy synchronization and enforcement are still required.
6. **App/Domain Enforcement:** Application and domain request approval currently updates the request status; corresponding application/domain policy enforcement requires its own implementation.
7. **Routing Notice:** The Parent Get Permission Requests route is currently mounted at `/api/device/permission-requests` in the main router (not `/api/permission-requests`).

---

## 💡 Checklist Usage Guidelines

- `[ ]` Not started / Pending
- `[x]` Implemented & Tested

_Note: Update the checkbox only after completing the relevant implementation and writing unit/integration tests._
