import { useState } from "react";
import { Alert, Pressable, Switch, Text, TextInput, View } from "react-native";
import { C, PageHeader, Screen } from "../../components/ui";

export default function BrowserPolicyScreen() {
  const [safeSearch, setSafeSearch] = useState(true);
  const [categoryStates, setCategoryStates] = useState({
    adult: true,
    gambling: true,
    malware: true,
    social: false,
  });
  const [domain, setDomain] = useState("");
  const [blockedDomains, setBlockedDomains] = useState([
    "example-gambling.test",
    "unsafe-site.test",
  ]);

  const addDomain = () => {
    const normalizedDomain = domain.trim().toLowerCase();
    if (!normalizedDomain || !normalizedDomain.includes(".")) {
      Alert.alert("Enter a domain", "Use a domain such as example.com.");
      return;
    }
    setBlockedDomains((current) =>
      current.includes(normalizedDomain)
        ? current
        : [...current, normalizedDomain],
    );
    setDomain("");
  };

  const categories = [
    {
      key: "adult" as const,
      label: "Adult content",
      note: "Explicit or age-restricted sites",
    },
    {
      key: "gambling" as const,
      label: "Gambling",
      note: "Betting and casino websites",
    },
    {
      key: "malware" as const,
      label: "Malware & phishing",
      note: "Known harmful domains",
    },
    {
      key: "social" as const,
      label: "Social media",
      note: "Social networking sites",
    },
  ];

  return (
    <Screen>
      <PageHeader
        title="Browser & DNS"
        subtitle="Shape safer browsing with family web rules."
      />
      <View
        style={{
          backgroundColor: "#FFF8E9",
          borderColor: "#F1E3C5",
          borderWidth: 1,
          borderRadius: 14,
          padding: 13,
          marginBottom: 17,
        }}
      >
        <Text style={{ color: "#72551A", fontSize: 12, lineHeight: 18 }}>
          Preview controls only. No DNS profile, blocklist, or browser rule is
          active until connected services are implemented.
        </Text>
      </View>

      <View
        style={{
          backgroundColor: C.navy,
          borderRadius: 17,
          padding: 17,
          marginBottom: 18,
          flexDirection: "row",
          alignItems: "center",
          gap: 13,
        }}
      >
        <View
          style={{
            width: 43,
            height: 43,
            borderRadius: 14,
            backgroundColor: "#334563",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "#C5D2E8", fontSize: 21 }}>⌕</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: C.white, fontSize: 14, fontWeight: "800" }}>
            Family web protection
          </Text>
          <Text style={{ color: "#C5D2E8", fontSize: 11, marginTop: 4 }}>
            Not connected · Preview mode
          </Text>
        </View>
        <View
          style={{
            backgroundColor: "#58657A",
            borderRadius: 14,
            paddingHorizontal: 8,
            paddingVertical: 5,
          }}
        >
          <Text style={{ color: C.white, fontSize: 9, fontWeight: "900" }}>
            OFFLINE
          </Text>
        </View>
      </View>

      <Text
        style={{
          color: C.navy,
          fontSize: 16,
          fontWeight: "900",
          marginBottom: 10,
        }}
      >
        Content categories
      </Text>
      <View
        style={{
          backgroundColor: C.white,
          borderWidth: 1,
          borderColor: C.border,
          borderRadius: 15,
          paddingHorizontal: 14,
          marginBottom: 18,
        }}
      >
        {categories.map((category, index) => (
          <View
            key={category.key}
            style={{
              minHeight: 64,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottomWidth: index === categories.length - 1 ? 0 : 1,
              borderBottomColor: C.border,
            }}
          >
            <View style={{ flex: 1, paddingRight: 8 }}>
              <Text style={{ color: C.navy, fontSize: 12, fontWeight: "800" }}>
                {category.label}
              </Text>
              <Text style={{ color: C.muted, fontSize: 10, marginTop: 4 }}>
                {category.note}
              </Text>
            </View>
            <Switch
              value={categoryStates[category.key]}
              onValueChange={(value) =>
                setCategoryStates((current) => ({
                  ...current,
                  [category.key]: value,
                }))
              }
              trackColor={{ false: "#DCE2E9", true: "#8BC7A5" }}
              thumbColor={categoryStates[category.key] ? "#28744D" : "#FFFFFF"}
              accessibilityLabel={`Preview ${category.label} filter`}
            />
          </View>
        ))}
      </View>

      <View
        style={{
          backgroundColor: C.white,
          borderWidth: 1,
          borderColor: C.border,
          borderRadius: 15,
          padding: 15,
          marginBottom: 17,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flex: 1, paddingRight: 10 }}>
            <Text style={{ color: C.navy, fontSize: 13, fontWeight: "800" }}>
              SafeSearch
            </Text>
            <Text style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>
              Filter explicit results in supported search engines
            </Text>
          </View>
          <Switch
            value={safeSearch}
            onValueChange={setSafeSearch}
            trackColor={{ false: "#DCE2E9", true: "#8BC7A5" }}
            thumbColor={safeSearch ? "#28744D" : "#FFFFFF"}
            accessibilityLabel="Preview SafeSearch"
          />
        </View>
        <View
          style={{ height: 1, backgroundColor: C.border, marginVertical: 13 }}
        />
        <Text style={{ color: C.muted, fontSize: 10, fontWeight: "800" }}>
          DNS FILTERING
        </Text>
        <View
          style={{
            marginTop: 9,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ color: C.navy, fontSize: 12 }}>
            Encrypted DNS profile
          </Text>
          <Text style={{ color: "#946D20", fontSize: 11, fontWeight: "800" }}>
            Not configured
          </Text>
        </View>
        <Text
          style={{ color: C.muted, fontSize: 10, lineHeight: 15, marginTop: 6 }}
        >
          A backend provider and managed device profile are required to enforce
          DoH or DoT.
        </Text>
      </View>

      <Text
        style={{
          color: C.navy,
          fontSize: 16,
          fontWeight: "900",
          marginBottom: 9,
        }}
      >
        Blocked domains · preview
      </Text>
      <View style={{ flexDirection: "row", gap: 8, marginBottom: 10 }}>
        <TextInput
          value={domain}
          onChangeText={setDomain}
          placeholder="example.com"
          placeholderTextColor="#9AA5B5"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          accessibilityLabel="Domain to block"
          style={{
            flex: 1,
            height: 46,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: C.border,
            backgroundColor: C.white,
            paddingHorizontal: 13,
            color: C.text,
            fontSize: 12,
          }}
        />
        <Pressable
          accessibilityRole="button"
          onPress={addDomain}
          style={{
            width: 55,
            borderRadius: 12,
            backgroundColor: C.navy,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: C.white, fontSize: 20, fontWeight: "700" }}>
            +
          </Text>
        </Pressable>
      </View>
      <View
        style={{
          backgroundColor: C.white,
          borderWidth: 1,
          borderColor: C.border,
          borderRadius: 15,
          paddingHorizontal: 14,
        }}
      >
        {blockedDomains.length === 0 ? (
          <Text style={{ color: C.muted, fontSize: 12, paddingVertical: 15 }}>
            No domains added.
          </Text>
        ) : (
          blockedDomains.map((blockedDomain, index) => (
            <View
              key={blockedDomain}
              style={{
                minHeight: 47,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottomWidth: index === blockedDomains.length - 1 ? 0 : 1,
                borderBottomColor: C.border,
              }}
            >
              <Text style={{ color: C.text, fontSize: 12, flex: 1 }}>
                {blockedDomain}
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Remove ${blockedDomain}`}
                onPress={() =>
                  setBlockedDomains((current) =>
                    current.filter((item) => item !== blockedDomain),
                  )
                }
                style={{
                  minWidth: 44,
                  minHeight: 40,
                  alignItems: "flex-end",
                  justifyContent: "center",
                }}
              >
                <Text style={{ color: C.red, fontSize: 11, fontWeight: "800" }}>
                  Remove
                </Text>
              </Pressable>
            </View>
          ))
        )}
      </View>
    </Screen>
  );
}
