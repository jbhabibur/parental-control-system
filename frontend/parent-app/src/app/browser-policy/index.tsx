import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { C, PageHeader, Screen } from "../../components/ui";
import { ApiError, api } from "../../lib/api";

type DeviceOption = { id: string; deviceName: string };
type DomainRule = {
  id: string;
  domain: string;
  action: "ALLOW" | "BLOCK";
  categoryId?: string | null;
};
type DomainCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
};
type DnsPolicy = {
  id?: string;
  enabled: boolean;
  provider?: string | null;
  dohEndpoint?: string | null;
  dotEndpoint?: string | null;
  safeSearch: boolean;
};

export default function BrowserPolicyScreen() {
  const [devices, setDevices] = useState<DeviceOption[]>([]);
  const [deviceId, setDeviceId] = useState("");
  const [policy, setPolicy] = useState<DnsPolicy | null>(null);
  const [rules, setRules] = useState<DomainRule[]>([]);
  const [categories, setCategories] = useState<DomainCategory[]>([]);
  const [domain, setDomain] = useState("");
  const [action, setAction] = useState<"ALLOW" | "BLOCK">("BLOCK");
  const [categoryName, setCategoryName] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [safeSearch, setSafeSearch] = useState(true);
  const [provider, setProvider] = useState("");
  const [dohEndpoint, setDohEndpoint] = useState("");
  const [dotEndpoint, setDotEndpoint] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCategories = async () => {
    const result = await api.categories.list();
    setCategories(
      Array.isArray(result.data) ? (result.data as DomainCategory[]) : [],
    );
  };

  useEffect(() => {
    let active = true;
    void Promise.all([api.devices.list(), api.categories.list()])
      .then(([deviceResult, categoryResult]) => {
        if (!active) return;
        const entries = Array.isArray(deviceResult.data)
          ? (deviceResult.data as DeviceOption[])
          : [];
        setDevices(entries);
        setDeviceId(entries[0]?.id || "");
        setCategories(
          Array.isArray(categoryResult.data)
            ? (categoryResult.data as DomainCategory[])
            : [],
        );
      })
      .catch((requestError) => {
        if (active)
          setError(
            requestError instanceof ApiError
              ? requestError.message
              : "Unable to load policy data.",
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!deviceId) return;
    let active = true;
    setLoading(true);
    setError("");
    void Promise.allSettled([api.dns.get(deviceId), api.dns.rules(deviceId)])
      .then(([policyResult, rulesResult]) => {
        if (!active) return;
        if (policyResult.status === "fulfilled") {
          const nextPolicy = policyResult.value.data as DnsPolicy;
          setPolicy(nextPolicy);
          setEnabled(nextPolicy.enabled);
          setSafeSearch(nextPolicy.safeSearch);
          setProvider(nextPolicy.provider || "");
          setDohEndpoint(nextPolicy.dohEndpoint || "");
          setDotEndpoint(nextPolicy.dotEndpoint || "");
        } else if (
          policyResult.reason instanceof ApiError &&
          policyResult.reason.status === 404
        ) {
          setPolicy(null);
        } else {
          setError(
            policyResult.reason instanceof ApiError
              ? policyResult.reason.message
              : "Unable to load DNS policy.",
          );
        }
        if (rulesResult.status === "fulfilled")
          setRules(
            Array.isArray(rulesResult.value.data)
              ? (rulesResult.value.data as DomainRule[])
              : [],
          );
        else if (
          !(
            rulesResult.reason instanceof ApiError &&
            rulesResult.reason.status === 404
          )
        )
          setError(
            rulesResult.reason instanceof ApiError
              ? rulesResult.reason.message
              : "Unable to load domain rules.",
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [deviceId]);

  const savePolicy = async () => {
    if (!deviceId) return;
    try {
      const body = {
        enabled,
        safeSearch,
        provider: provider.trim() || undefined,
        dohEndpoint: dohEndpoint.trim() || undefined,
        dotEndpoint: dotEndpoint.trim() || undefined,
      };
      const result = policy
        ? await api.dns.update(deviceId, body)
        : await api.dns.create(deviceId, body);
      setPolicy(result.data as DnsPolicy);
      Alert.alert(
        "Saved",
        "DNS policy was saved. Device enforcement depends on child-side policy sync.",
      );
    } catch (requestError) {
      Alert.alert(
        "Could not save DNS policy",
        requestError instanceof ApiError
          ? requestError.message
          : "Please check the endpoint values and try again.",
      );
    }
  };

  const addRule = async () => {
    const normalizedDomain = domain.trim().toLowerCase();
    if (!deviceId || !policy || !normalizedDomain.includes(".")) {
      Alert.alert(
        "Domain rule unavailable",
        "Create a DNS policy first, then enter a valid domain.",
      );
      return;
    }
    try {
      await api.dns.createRule(deviceId, { domain: normalizedDomain, action });
      setDomain("");
      const result = await api.dns.rules(deviceId);
      setRules(Array.isArray(result.data) ? (result.data as DomainRule[]) : []);
    } catch (requestError) {
      Alert.alert(
        "Could not add domain rule",
        requestError instanceof ApiError
          ? requestError.message
          : "Please try again.",
      );
    }
  };

  const deleteRule = async (ruleId: string) => {
    try {
      await api.dns.deleteRule(deviceId, ruleId);
      setRules((current) => current.filter((rule) => rule.id !== ruleId));
    } catch (requestError) {
      Alert.alert(
        "Could not delete rule",
        requestError instanceof ApiError
          ? requestError.message
          : "Please try again.",
      );
    }
  };

  const addCategory = async () => {
    const name = categoryName.trim();
    if (!name) return;
    try {
      await api.categories.create({
        name,
        slug: name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, ""),
      });
      setCategoryName("");
      await loadCategories();
    } catch (requestError) {
      Alert.alert(
        "Could not create category",
        requestError instanceof ApiError
          ? requestError.message
          : "Please try another category name.",
      );
    }
  };

  const deleteCategory = async (categoryId: string) => {
    try {
      await api.categories.delete(categoryId);
      await loadCategories();
    } catch (requestError) {
      Alert.alert(
        "Could not delete category",
        requestError instanceof ApiError
          ? requestError.message
          : "A category may still be in use by a rule.",
      );
    }
  };

  return (
    <Screen>
      <PageHeader
        title="Browser & DNS"
        subtitle="Configure DNS policy and domain rules for a connected device."
      />
      {loading && <ActivityIndicator color={C.blue} />}
      {!!error && (
        <Text
          accessibilityRole="alert"
          style={{ color: C.red, marginBottom: 12 }}
        >
          {error}
        </Text>
      )}
      {devices.length === 0 && !loading && (
        <Text style={{ color: C.muted }}>
          Connect a child device before configuring web rules.
        </Text>
      )}
      {devices.map((item) => (
        <Pressable
          key={item.id}
          onPress={() => setDeviceId(item.id)}
          style={{
            borderWidth: 1,
            borderColor: item.id === deviceId ? C.blue : C.border,
            backgroundColor: item.id === deviceId ? C.pale : C.white,
            borderRadius: 10,
            padding: 12,
            marginBottom: 7,
          }}
        >
          <Text style={{ color: C.navy, fontWeight: "800" }}>
            {item.deviceName}
          </Text>
        </Pressable>
      ))}
      {!!deviceId && (
        <>
          <View
            style={{
              backgroundColor: C.white,
              borderWidth: 1,
              borderColor: C.border,
              borderRadius: 14,
              padding: 15,
              marginTop: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ color: C.navy, fontWeight: "900" }}>
                DNS filtering enabled
              </Text>
              <Switch value={enabled} onValueChange={setEnabled} />
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 10,
              }}
            >
              <Text style={{ color: C.navy, fontWeight: "700" }}>
                SafeSearch
              </Text>
              <Switch value={safeSearch} onValueChange={setSafeSearch} />
            </View>
            <TextInput
              value={provider}
              onChangeText={setProvider}
              placeholder="Provider (optional)"
              style={{
                borderWidth: 1,
                borderColor: C.border,
                borderRadius: 9,
                padding: 10,
                marginTop: 12,
                color: C.text,
              }}
            />
            <TextInput
              value={dohEndpoint}
              onChangeText={setDohEndpoint}
              placeholder="DNS-over-HTTPS URL"
              autoCapitalize="none"
              style={{
                borderWidth: 1,
                borderColor: C.border,
                borderRadius: 9,
                padding: 10,
                marginTop: 8,
                color: C.text,
              }}
            />
            <TextInput
              value={dotEndpoint}
              onChangeText={setDotEndpoint}
              placeholder="DNS-over-TLS endpoint"
              autoCapitalize="none"
              style={{
                borderWidth: 1,
                borderColor: C.border,
                borderRadius: 9,
                padding: 10,
                marginTop: 8,
                color: C.text,
              }}
            />
            <Pressable
              onPress={() => void savePolicy()}
              style={{
                minHeight: 44,
                backgroundColor: C.blue,
                borderRadius: 9,
                alignItems: "center",
                justifyContent: "center",
                marginTop: 12,
              }}
            >
              <Text style={{ color: C.white, fontWeight: "800" }}>
                {policy ? "Update DNS policy" : "Create DNS policy"}
              </Text>
            </Pressable>
          </View>
          <Text
            style={{
              color: C.navy,
              fontWeight: "900",
              fontSize: 17,
              marginTop: 20,
              marginBottom: 9,
            }}
          >
            Domain rules
          </Text>
          <View style={{ flexDirection: "row", gap: 7, marginBottom: 8 }}>
            <TextInput
              value={domain}
              onChangeText={setDomain}
              placeholder="example.com"
              autoCapitalize="none"
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: C.border,
                borderRadius: 9,
                padding: 10,
                color: C.text,
              }}
            />
            <Pressable
              onPress={() => setAction(action === "BLOCK" ? "ALLOW" : "BLOCK")}
              style={{
                justifyContent: "center",
                paddingHorizontal: 10,
                borderWidth: 1,
                borderColor: C.border,
                borderRadius: 9,
              }}
            >
              <Text style={{ color: C.navy, fontWeight: "800" }}>{action}</Text>
            </Pressable>
            <Pressable
              onPress={() => void addRule()}
              style={{
                justifyContent: "center",
                paddingHorizontal: 14,
                backgroundColor: C.navy,
                borderRadius: 9,
              }}
            >
              <Text style={{ color: C.white, fontWeight: "900" }}>Add</Text>
            </Pressable>
          </View>
          {rules.map((rule) => (
            <View
              key={rule.id}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingVertical: 11,
                borderBottomWidth: 1,
                borderColor: C.border,
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ color: C.navy, fontWeight: "700" }}>
                  {rule.domain}
                </Text>
                <Text
                  style={{
                    color: rule.action === "BLOCK" ? C.red : C.green,
                    fontSize: 10,
                    fontWeight: "800",
                    marginTop: 3,
                  }}
                >
                  {rule.action}
                </Text>
              </View>
              <Pressable onPress={() => void deleteRule(rule.id)}>
                <Text style={{ color: C.red, fontWeight: "800" }}>Delete</Text>
              </Pressable>
            </View>
          ))}
        </>
      )}
      <Text
        style={{
          color: C.navy,
          fontWeight: "900",
          fontSize: 17,
          marginTop: 22,
          marginBottom: 9,
        }}
      >
        Domain categories
      </Text>
      <View style={{ flexDirection: "row", gap: 7 }}>
        <TextInput
          value={categoryName}
          onChangeText={setCategoryName}
          placeholder="New category"
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: C.border,
            borderRadius: 9,
            padding: 10,
            color: C.text,
          }}
        />
        <Pressable
          onPress={() => void addCategory()}
          style={{
            justifyContent: "center",
            paddingHorizontal: 14,
            backgroundColor: C.navy,
            borderRadius: 9,
          }}
        >
          <Text style={{ color: C.white, fontWeight: "900" }}>Create</Text>
        </Pressable>
      </View>
      {categories.map((category) => (
        <View
          key={category.id}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingVertical: 10,
            borderBottomWidth: 1,
            borderColor: C.border,
          }}
        >
          <Text style={{ color: C.text }}>
            {category.name} · {category.slug}
          </Text>
          <Pressable onPress={() => void deleteCategory(category.id)}>
            <Text style={{ color: C.red, fontWeight: "800" }}>Delete</Text>
          </Pressable>
        </View>
      ))}
      <Text
        style={{ color: C.muted, fontSize: 11, lineHeight: 17, marginTop: 14 }}
      >
        Saving a database policy does not by itself configure a managed DNS
        profile or enforce policy on the operating system.
      </Text>
    </Screen>
  );
}
