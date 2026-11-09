import {
  createDnsPolicy,
  getDnsPolicy,
  updateDnsPolicy,
  addDomainRule,
  getDomainRules,
  updateDomainRule,
  deleteDomainRule,
} from "../services/dns-policy.service.js";

import { createAuditLog } from "../services/audit-log.service.js";

// ========== CREATE DNS POLICY ==========
export const createPolicy = async (req, res) => {
  try {
    const data = await createDnsPolicy(
      req.user.id,
      req.params.deviceId,
      req.body,
    );

    await createAuditLog({
      actorId: req.user.id,
      deviceId: req.params.deviceId,
      action: "DNS_POLICY_CREATED",
      entityType: "DnsPolicy",
      entityId: data.id,
      ipAddress: req.ip,
    });

    return res.status(201).json({
      success: true,
      message: "DNS policy created successfully",
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========== Get DNS Policy (PARENT) ==========
export const getPolicy = async (req, res) => {
  try {
    const data = await getDnsPolicy(req.user.id, req.params.deviceId);

    return res.status(200).json({
      success: true,
      message: "DNS policy retrieved successfully",
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========== Update DNS Policy (PARENT) ==========
export const updatePolicy = async (req, res) => {
  try {
    const data = await updateDnsPolicy(
      req.user.id,
      req.params.deviceId,
      req.body,
    );

    await createAuditLog({
      actorId: req.user.id,
      deviceId: req.params.deviceId,
      action: "DNS_POLICY_UPDATED",
      entityType: "DnsPolicy",
      entityId: data.id,
      ipAddress: req.ip,
    });

    return res.status(200).json({
      success: true,
      message: "DNS policy updated successfully",
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========== Add Domain Rule (PARENT) ==========
export const createDomainRule = async (req, res) => {
  try {
    const data = await addDomainRule(
      req.user.id,
      req.params.deviceId,
      req.body,
    );

    await createAuditLog({
      actorId: req.user.id,
      deviceId: req.params.deviceId,
      action: "DOMAIN_RULE_CREATED",
      entityType: "DomainRule",
      entityId: data.id,
      metadata: {
        domain: data.domain,
        action: data.action,
      },
      ipAddress: req.ip,
    });

    return res.status(201).json({
      success: true,
      message: "Domain rule created successfully",
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========== Get Domain Rules (PARENT) ==========
export const getRules = async (req, res) => {
  try {
    const data = await getDomainRules(req.user.id, req.params.deviceId);

    return res.status(200).json({
      success: true,
      message: "Domain rules retrieved successfully",
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========== Update Domain Rule (PARENT) ==========
export const updateRule = async (req, res) => {
  try {
    const data = await updateDomainRule(
      req.user.id,
      req.params.deviceId,
      req.params.ruleId,
      req.body,
    );

    await createAuditLog({
      actorId: req.user.id,
      deviceId: req.params.deviceId,
      action: "DOMAIN_RULE_UPDATED",
      entityType: "DomainRule",
      entityId: req.params.ruleId,
      metadata: {
        domain: data.domain,
        action: data.action,
      },
      ipAddress: req.ip,
    });

    return res.status(200).json({
      success: true,
      message: "Domain rule updated successfully",
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========== DELETE DOMAIN RULE (PARENT) ==========
export const deleteRule = async (req, res) => {
  try {
    await deleteDomainRule(req.user.id, req.params.deviceId, req.params.ruleId);

    await createAuditLog({
      actorId: req.user.id,
      deviceId: req.params.deviceId,
      action: "DOMAIN_RULE_DELETED",
      entityType: "DomainRule",
      entityId: req.params.ruleId,
      ipAddress: req.ip,
    });

    return res.status(200).json({
      success: true,
      message: "Domain rule deleted successfully",
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};
