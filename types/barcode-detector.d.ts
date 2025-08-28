interface BarcodeDetectorOptions {
  formats?: string[];
}

interface BarcodeDetectorResult {
  boundingBox: DOMRectReadOnly;
  cornerPoints: {
    x: number;
    y: number;
  }[];
  format: string;
  rawValue: string;
}

interface BarcodeDetector {
  detect(image: ImageBitmapSource): Promise<BarcodeDetectorResult[]>;
}

interface BarcodeDetectorConstructor {
  new(options?: BarcodeDetectorOptions): BarcodeDetector;
}

interface Window {
  BarcodeDetector?: BarcodeDetectorConstructor;
}
