import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import {
  ScanbotBarcodeCameraView,
  ScanbotBarcodeSDK,
  BarcodeScannerConfiguration,
  type BarcodeScannerSession,
  LicenseInfoResult,
  ScanbotBarcodeSdkConfiguration,
  MockCameraParams,
} from "react-native-scanbot-barcode-scanner-sdk";

export default function Scaner() {
  const [sdkInitialized, setSdkInitialized] = useState(false);

  useEffect(() => {
    initializeSDK();
  }, []);

  const initializeSDK = async () => {
    try {
      const licenseKey = Platform.select({
        android: "YOUR_ANDROID_LICENSE_KEY",
        ios: "YOUR_IOS_LICENSE_KEY",
      }) || "";

      const config: ScanbotBarcodeSdkConfiguration = {
        licenseKey: licenseKey,
        loggingEnabled: true,
        // Configuraciones adicionales si las necesitas
      };

      const licenseInfo: LicenseInfoResult = await ScanbotBarcodeSDK.initializeSdk(config);
      
      if (licenseInfo.isValid) {
        console.log("SDK inicializado correctamente");
        setSdkInitialized(true);
      } else {
        console.warn("Licencia inválida o expirada");
        // El SDK funcionará en modo de prueba con marca de agua
        setSdkInitialized(true);
      }
    } catch (error) {
      console.error("Error al inicializar SDK:", error);
    }
  };

  const handleBarcodeDetected = (session: BarcodeScannerSession) => {
    const barcodes = session.newlyRecognizedBarcodes;

    if (barcodes.length > 0) {
      console.log("Código detectado:", barcodes[0].text);
      alert("Código: " + barcodes[0].text);
    }
  };

  const scannerConfig: BarcodeScannerConfiguration = {
    // cameraPreviewMode no existe en la configuración actual
    // Usa la propiedad 'camera' en su lugar
    camera: {
      previewMode: "FILL_IN",
      zoomEnabled: true,
    },
    barcodeFormats: ["EAN_13", "CODE_128", "QR_CODE"],
    engineMode: "NEXT_GEN",
    finderOverlay: {
      enabled: true,
      width: 300,
      height: 200,
      strokeWidth: 2,
      strokeColor: "#00eaff",
      backgroundColor: "rgba(0, 0, 0, 0.3)",
    },
    continuousDetection: true,
  };

  if (!sdkInitialized) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Inicializando escáner...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Escáner de Código de Barras</Text>

      <ScanbotBarcodeCameraView
        style={{ flex: 1 }}
        configuration={scannerConfig}
        onBarcodeDetected={handleBarcodeDetected}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  title: {
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
    fontSize: 18,
  },
});