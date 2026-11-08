-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('PARENT', 'CHILD');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'DELETED');

-- CreateEnum
CREATE TYPE "DevicePlatform" AS ENUM ('ANDROID', 'IOS');

-- CreateEnum
CREATE TYPE "DeviceStatus" AS ENUM ('ACTIVE', 'OFFLINE', 'LOCKED', 'PAUSED', 'REMOVED');

-- CreateEnum
CREATE TYPE "PairingStatus" AS ENUM ('PENDING', 'COMPLETED', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PermissionType" AS ENUM ('CAMERA', 'MICROPHONE', 'LOCATION', 'STORAGE', 'CONTACTS', 'NOTIFICATIONS', 'OTHER');

-- CreateEnum
CREATE TYPE "RequestType" AS ENUM ('HARDWARE_PERMISSION', 'APPLICATION_ACCESS', 'DOMAIN_ACCESS');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'APPROVED', 'DENIED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "AppDecision" AS ENUM ('ALLOW', 'BLOCK');

-- CreateEnum
CREATE TYPE "CommandType" AS ENUM ('LOCK', 'UNLOCK', 'PAUSE', 'RESUME', 'SYNC_POLICY');

-- CreateEnum
CREATE TYPE "CommandStatus" AS ENUM ('PENDING', 'SENT', 'ACKNOWLEDGED', 'FAILED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "DomainAction" AS ENUM ('ALLOW', 'BLOCK');

-- CreateEnum
CREATE TYPE "AlertType" AS ENUM ('PROHIBITED_APP_LAUNCH', 'APP_INSTALL_ATTEMPT', 'PROHIBITED_DOMAIN', 'MALWARE_DETECTED', 'PHISHING_DETECTED', 'ROOT_DETECTED', 'TAMPER_DETECTED', 'DEVICE_OFFLINE', 'SCREEN_TIME_EXCEEDED', 'BEDTIME_VIOLATION', 'PERMISSION_REQUEST', 'OTHER');

-- CreateEnum
CREATE TYPE "AlertSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('PUSH', 'IN_APP');

-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('APP_LAUNCH', 'APP_CLOSE', 'DEVICE_ONLINE', 'DEVICE_OFFLINE', 'SCREEN_LOCK', 'SCREEN_UNLOCK', 'POLICY_VIOLATION', 'LOCATION_UPDATE', 'OTHER');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255),
    "passwordHash" TEXT,
    "role" "UserRole" NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "parentId" UUID,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Device" (
    "id" UUID NOT NULL,
    "childId" UUID NOT NULL,
    "deviceIdentifier" VARCHAR(255) NOT NULL,
    "deviceName" VARCHAR(150) NOT NULL,
    "platform" "DevicePlatform" NOT NULL,
    "osVersion" VARCHAR(100),
    "appVersion" VARCHAR(50),
    "status" "DeviceStatus" NOT NULL DEFAULT 'ACTIVE',
    "pushToken" TEXT,
    "lastSeenAt" TIMESTAMPTZ(6),
    "lastIpAddress" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DevicePairing" (
    "id" UUID NOT NULL,
    "parentId" UUID NOT NULL,
    "childId" UUID NOT NULL,
    "deviceId" UUID,
    "pairingCodeHash" TEXT NOT NULL,
    "status" "PairingStatus" NOT NULL DEFAULT 'PENDING',
    "expiresAt" TIMESTAMPTZ(6) NOT NULL,
    "completedAt" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DevicePairing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DevicePermission" (
    "id" UUID NOT NULL,
    "deviceId" UUID NOT NULL,
    "permissionType" "PermissionType" NOT NULL,
    "allowed" BOOLEAN NOT NULL DEFAULT false,
    "updatedById" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "DevicePermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PermissionRequest" (
    "id" UUID NOT NULL,
    "childId" UUID NOT NULL,
    "deviceId" UUID NOT NULL,
    "requestType" "RequestType" NOT NULL,
    "resource" VARCHAR(500) NOT NULL,
    "reason" VARCHAR(500),
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "reviewedById" UUID,
    "reviewedAt" TIMESTAMPTZ(6),
    "expiresAt" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "PermissionRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppPolicy" (
    "id" UUID NOT NULL,
    "deviceId" UUID NOT NULL,
    "appIdentifier" VARCHAR(255) NOT NULL,
    "appName" VARCHAR(150),
    "decision" "AppDecision" NOT NULL,
    "category" VARCHAR(100),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "AppPolicy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScreenTimePolicy" (
    "id" UUID NOT NULL,
    "childId" UUID NOT NULL,
    "deviceId" UUID NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "dailyLimitMinutes" INTEGER NOT NULL,
    "bedtimeStart" VARCHAR(5),
    "bedtimeEnd" VARCHAR(5),
    "timezone" VARCHAR(100) NOT NULL DEFAULT 'Asia/Dhaka',
    "updatedById" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "ScreenTimePolicy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PerAppLimit" (
    "id" UUID NOT NULL,
    "screenTimePolicyId" UUID NOT NULL,
    "appIdentifier" VARCHAR(255) NOT NULL,
    "limitMinutes" INTEGER NOT NULL,

    CONSTRAINT "PerAppLimit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppUsage" (
    "id" UUID NOT NULL,
    "deviceId" UUID NOT NULL,
    "childId" UUID NOT NULL,
    "appIdentifier" VARCHAR(255) NOT NULL,
    "startedAt" TIMESTAMPTZ(6) NOT NULL,
    "endedAt" TIMESTAMPTZ(6),
    "durationSeconds" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AppUsage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeviceActivity" (
    "id" UUID NOT NULL,
    "deviceId" UUID NOT NULL,
    "activityType" "ActivityType" NOT NULL,
    "foregroundApp" VARCHAR(255),
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "metadata" JSONB,
    "capturedAt" TIMESTAMPTZ(6) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DeviceActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RemoteCommand" (
    "id" UUID NOT NULL,
    "deviceId" UUID NOT NULL,
    "childId" UUID NOT NULL,
    "issuedById" UUID NOT NULL,
    "commandType" "CommandType" NOT NULL,
    "status" "CommandStatus" NOT NULL DEFAULT 'PENDING',
    "payload" JSONB,
    "executedAt" TIMESTAMPTZ(6),
    "expiresAt" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RemoteCommand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DnsPolicy" (
    "id" UUID NOT NULL,
    "deviceId" UUID NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "provider" VARCHAR(100),
    "dohEndpoint" TEXT,
    "dotEndpoint" TEXT,
    "safeSearch" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "DnsPolicy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DomainCategory" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DomainCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DomainRule" (
    "id" UUID NOT NULL,
    "dnsPolicyId" UUID NOT NULL,
    "categoryId" UUID,
    "domain" VARCHAR(255) NOT NULL,
    "action" "DomainAction" NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DomainRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BrowserHistory" (
    "id" UUID NOT NULL,
    "deviceId" UUID NOT NULL,
    "childId" UUID NOT NULL,
    "url" TEXT NOT NULL,
    "domain" VARCHAR(255) NOT NULL,
    "pageTitle" TEXT,
    "blocked" BOOLEAN NOT NULL DEFAULT false,
    "category" VARCHAR(100),
    "visitedAt" TIMESTAMPTZ(6) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BrowserHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SecurityAlert" (
    "id" UUID NOT NULL,
    "childId" UUID NOT NULL,
    "deviceId" UUID,
    "type" "AlertType" NOT NULL,
    "severity" "AlertSeverity" NOT NULL DEFAULT 'MEDIUM',
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "metadata" JSONB,
    "acknowledgedAt" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SecurityAlert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "alertId" UUID,
    "title" VARCHAR(200) NOT NULL,
    "body" TEXT NOT NULL,
    "channel" "NotificationChannel" NOT NULL DEFAULT 'IN_APP',
    "readAt" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "deviceId" UUID,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMPTZ(6) NOT NULL,
    "revokedAt" TIMESTAMPTZ(6),
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MfaConfiguration" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "secretEncrypted" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "confirmedAt" TIMESTAMPTZ(6),
    "recoveryCodesHash" JSONB,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "MfaConfiguration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" UUID NOT NULL,
    "actorId" UUID NOT NULL,
    "deviceId" UUID,
    "action" VARCHAR(150) NOT NULL,
    "entityType" VARCHAR(100),
    "entityId" VARCHAR(100),
    "metadata" JSONB,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_parentId_role_idx" ON "User"("parentId", "role");

-- CreateIndex
CREATE INDEX "User_role_status_idx" ON "User"("role", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Device_deviceIdentifier_key" ON "Device"("deviceIdentifier");

-- CreateIndex
CREATE INDEX "Device_childId_status_idx" ON "Device"("childId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "DevicePairing_deviceId_key" ON "DevicePairing"("deviceId");

-- CreateIndex
CREATE UNIQUE INDEX "DevicePairing_pairingCodeHash_key" ON "DevicePairing"("pairingCodeHash");

-- CreateIndex
CREATE INDEX "DevicePairing_parentId_status_idx" ON "DevicePairing"("parentId", "status");

-- CreateIndex
CREATE INDEX "DevicePairing_childId_status_idx" ON "DevicePairing"("childId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "DevicePermission_deviceId_permissionType_key" ON "DevicePermission"("deviceId", "permissionType");

-- CreateIndex
CREATE INDEX "PermissionRequest_childId_status_idx" ON "PermissionRequest"("childId", "status");

-- CreateIndex
CREATE INDEX "PermissionRequest_deviceId_createdAt_idx" ON "PermissionRequest"("deviceId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "AppPolicy_deviceId_appIdentifier_key" ON "AppPolicy"("deviceId", "appIdentifier");

-- CreateIndex
CREATE UNIQUE INDEX "ScreenTimePolicy_deviceId_key" ON "ScreenTimePolicy"("deviceId");

-- CreateIndex
CREATE INDEX "ScreenTimePolicy_childId_idx" ON "ScreenTimePolicy"("childId");

-- CreateIndex
CREATE UNIQUE INDEX "PerAppLimit_screenTimePolicyId_appIdentifier_key" ON "PerAppLimit"("screenTimePolicyId", "appIdentifier");

-- CreateIndex
CREATE INDEX "AppUsage_deviceId_startedAt_idx" ON "AppUsage"("deviceId", "startedAt");

-- CreateIndex
CREATE INDEX "AppUsage_appIdentifier_idx" ON "AppUsage"("appIdentifier");

-- CreateIndex
CREATE INDEX "AppUsage_childId_startedAt_idx" ON "AppUsage"("childId", "startedAt");

-- CreateIndex
CREATE INDEX "DeviceActivity_deviceId_capturedAt_idx" ON "DeviceActivity"("deviceId", "capturedAt");

-- CreateIndex
CREATE INDEX "DeviceActivity_activityType_capturedAt_idx" ON "DeviceActivity"("activityType", "capturedAt");

-- CreateIndex
CREATE INDEX "RemoteCommand_deviceId_status_idx" ON "RemoteCommand"("deviceId", "status");

-- CreateIndex
CREATE INDEX "RemoteCommand_childId_createdAt_idx" ON "RemoteCommand"("childId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "DnsPolicy_deviceId_key" ON "DnsPolicy"("deviceId");

-- CreateIndex
CREATE UNIQUE INDEX "DomainCategory_name_key" ON "DomainCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "DomainCategory_slug_key" ON "DomainCategory"("slug");

-- CreateIndex
CREATE INDEX "DomainRule_categoryId_idx" ON "DomainRule"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "DomainRule_dnsPolicyId_domain_key" ON "DomainRule"("dnsPolicyId", "domain");

-- CreateIndex
CREATE INDEX "BrowserHistory_deviceId_visitedAt_idx" ON "BrowserHistory"("deviceId", "visitedAt");

-- CreateIndex
CREATE INDEX "BrowserHistory_childId_visitedAt_idx" ON "BrowserHistory"("childId", "visitedAt");

-- CreateIndex
CREATE INDEX "BrowserHistory_domain_idx" ON "BrowserHistory"("domain");

-- CreateIndex
CREATE INDEX "SecurityAlert_childId_createdAt_idx" ON "SecurityAlert"("childId", "createdAt");

-- CreateIndex
CREATE INDEX "SecurityAlert_severity_acknowledgedAt_idx" ON "SecurityAlert"("severity", "acknowledgedAt");

-- CreateIndex
CREATE INDEX "Notification_userId_readAt_createdAt_idx" ON "Notification"("userId", "readAt", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_tokenHash_key" ON "RefreshToken"("tokenHash");

-- CreateIndex
CREATE INDEX "RefreshToken_userId_expiresAt_idx" ON "RefreshToken"("userId", "expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "MfaConfiguration_userId_key" ON "MfaConfiguration"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_actorId_createdAt_idx" ON "AuditLog"("actorId", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_action_createdAt_idx" ON "AuditLog"("action", "createdAt");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_childId_fkey" FOREIGN KEY ("childId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DevicePairing" ADD CONSTRAINT "DevicePairing_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DevicePairing" ADD CONSTRAINT "DevicePairing_childId_fkey" FOREIGN KEY ("childId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DevicePairing" ADD CONSTRAINT "DevicePairing_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DevicePermission" ADD CONSTRAINT "DevicePermission_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DevicePermission" ADD CONSTRAINT "DevicePermission_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermissionRequest" ADD CONSTRAINT "PermissionRequest_childId_fkey" FOREIGN KEY ("childId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermissionRequest" ADD CONSTRAINT "PermissionRequest_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermissionRequest" ADD CONSTRAINT "PermissionRequest_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppPolicy" ADD CONSTRAINT "AppPolicy_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScreenTimePolicy" ADD CONSTRAINT "ScreenTimePolicy_childId_fkey" FOREIGN KEY ("childId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScreenTimePolicy" ADD CONSTRAINT "ScreenTimePolicy_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScreenTimePolicy" ADD CONSTRAINT "ScreenTimePolicy_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerAppLimit" ADD CONSTRAINT "PerAppLimit_screenTimePolicyId_fkey" FOREIGN KEY ("screenTimePolicyId") REFERENCES "ScreenTimePolicy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppUsage" ADD CONSTRAINT "AppUsage_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppUsage" ADD CONSTRAINT "AppUsage_childId_fkey" FOREIGN KEY ("childId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeviceActivity" ADD CONSTRAINT "DeviceActivity_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RemoteCommand" ADD CONSTRAINT "RemoteCommand_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RemoteCommand" ADD CONSTRAINT "RemoteCommand_childId_fkey" FOREIGN KEY ("childId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RemoteCommand" ADD CONSTRAINT "RemoteCommand_issuedById_fkey" FOREIGN KEY ("issuedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DnsPolicy" ADD CONSTRAINT "DnsPolicy_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DomainRule" ADD CONSTRAINT "DomainRule_dnsPolicyId_fkey" FOREIGN KEY ("dnsPolicyId") REFERENCES "DnsPolicy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DomainRule" ADD CONSTRAINT "DomainRule_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "DomainCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrowserHistory" ADD CONSTRAINT "BrowserHistory_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrowserHistory" ADD CONSTRAINT "BrowserHistory_childId_fkey" FOREIGN KEY ("childId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SecurityAlert" ADD CONSTRAINT "SecurityAlert_childId_fkey" FOREIGN KEY ("childId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SecurityAlert" ADD CONSTRAINT "SecurityAlert_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_alertId_fkey" FOREIGN KEY ("alertId") REFERENCES "SecurityAlert"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MfaConfiguration" ADD CONSTRAINT "MfaConfiguration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE SET NULL ON UPDATE CASCADE;
