/**
 * @file LocationScreen.tsx
 * @description UI Component for the Location feature.
 *
 * Responsibilities:
 *  1. Device selector buttons to pick which child device to view.
 *  2. Display the latest GPS fix reported by the device.
 *  3. Display breadcrumb history of past locations.
 *  4. Platform note explaining companion app location reporting.
 */

import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { C, PageHeader, Screen } from "../../components/ui";
import { locationStyles as styles } from "./location.styles";
import { useLocation } from "./useLocation";

export function LocationScreen() {
  const {
    devices,
    deviceId,
    latest,
    history,
    loading,
    error,
    selectDevice,
  } = useLocation();

  return (
    <Screen>
      {/* ==================================================================== */}
      {/* 1. Header Section                                                    */}
      {/* ==================================================================== */}
      <PageHeader
        title="Location"
        subtitle="Location points reported by the child device."
      />

      {/* ==================================================================== */}
      {/* 2. Loading & Error States                                            */}
      {/* ==================================================================== */}
      {loading && <ActivityIndicator color={C.blue} />}
      {!!error && (
        <Text accessibilityRole="alert" style={{ color: C.red, marginBottom: 8 }}>
          {error}
        </Text>
      )}

      {/* ==================================================================== */}
      {/* 3. Device Selector                                                   */}
      {/* ==================================================================== */}
      {devices.map((item) => {
        const isSelected = item.id === deviceId;
        return (
          <Pressable
            key={item.id}
            onPress={() => selectDevice(item.id)}
            style={[
              styles.devicePill,
              isSelected && styles.devicePillActive,
            ]}
          >
            <Text style={styles.devicePillLabel}>{item.deviceName}</Text>
          </Pressable>
        );
      })}

      {/* ==================================================================== */}
      {/* 4. Latest GPS Coordinate Point                                       */}
      {/* ==================================================================== */}
      {latest && (
        <View style={styles.latestCard}>
          <Text style={styles.latestCardTitle}>Latest point</Text>
          <Text selectable style={styles.latestCardCoords}>
            {latest.latitude}, {latest.longitude}
          </Text>
          <Text style={styles.latestCardTime}>
            {new Date(latest.capturedAt).toLocaleString()}
          </Text>
        </View>
      )}

      {/* ==================================================================== */}
      {/* 5. Empty States                                                      */}
      {/* ==================================================================== */}
      {!loading && devices.length === 0 && (
        <Text style={styles.emptyText}>
          Connect a child device to view reported locations.
        </Text>
      )}
      {!loading && deviceId && !latest && (
        <Text style={styles.emptyText}>
          No location has been reported for this device.
        </Text>
      )}

      {/* ==================================================================== */}
      {/* 6. Location History Trail                                            */}
      {/* ==================================================================== */}
      <Text style={styles.sectionTitle}>
        History ({history.length})
      </Text>
      {history.map((point) => (
        <View key={point.id} style={styles.historyRow}>
          <Text selectable style={styles.historyRowCoords}>
            {point.latitude}, {point.longitude}
          </Text>
          <Text style={styles.historyRowTime}>
            {new Date(point.capturedAt).toLocaleString()}
          </Text>
        </View>
      ))}

      {/* ==================================================================== */}
      {/* 7. Disclaimer / Technical Note                                       */}
      {/* ==================================================================== */}
      <Text style={styles.note}>
        The backend only returns location data previously reported by a child
        client. This app does not collect GPS data itself.
      </Text>
    </Screen>
  );
}

export default LocationScreen;
