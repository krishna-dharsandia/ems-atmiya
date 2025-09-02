"use client";

import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Text, Image as KonvaImage, Group, Rect } from "react-konva";
import useImage from "use-image";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { HexColorPicker } from "react-colorful";
import { UploadIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// Define the placeholder type
export type CertificatePlaceholder = {
  key: string;
  label: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  fontFamily: string;
  dragging?: boolean; // Used for UI state only
};

// Props for the component
interface CertificateDesignerProps {
  templateUrl: string | null;
  placeholders: CertificatePlaceholder[];
  onPlaceholdersChange: (placeholders: CertificatePlaceholder[]) => void;
  onTemplateUpload: (file: File) => Promise<string>;
  width?: number;
  height?: number;
  previewData?: Record<string, string>; // Sample data for previewing
}

export default function CertificateDesigner({
  templateUrl,
  placeholders,
  onPlaceholdersChange,
  onTemplateUpload,
  width = 842, // A4 landscape width (in pixels at 96 DPI)
  height = 595, // A4 landscape height
  previewData = {
    name: "John Doe",
    event_name: "Tech Conference 2025",
    date: "August 31, 2025",
    registration_id: "TC2025-001",
  },
}: CertificateDesignerProps) {
  const [image] = useImage(templateUrl || "");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [imageWidth, setImageWidth] = useState(width);
  const [imageHeight, setImageHeight] = useState(height);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const stageRef = useRef<any>(null);
  const availableFonts = ["Helvetica", "Arial", "Times New Roman", "Courier New", "Verdana", "Georgia"];

  // Calculate scale when image loads
  useEffect(() => {
    if (image) {
      const imgRatio = image.width / image.height;
      const containerRatio = width / height;

      if (imgRatio > containerRatio) {
        // Image is wider than container
        setImageWidth(width);
        setImageHeight(width / imgRatio);
      } else {
        // Image is taller than container
        setImageHeight(height);
        setImageWidth(height * imgRatio);
      }
    }
  }, [image, width, height]);

  const handlePlaceholderDragEnd = (index: number, e: any) => {
    const updatedPlaceholders = [...placeholders];
    updatedPlaceholders[index] = {
      ...updatedPlaceholders[index],
      x: e.target.x(),
      y: e.target.y(),
      dragging: false,
    };
    onPlaceholdersChange(updatedPlaceholders);
  };

  const handlePlaceholderDragStart = (index: number) => {
    const updatedPlaceholders = [...placeholders];
    updatedPlaceholders[index] = {
      ...updatedPlaceholders[index],
      dragging: true,
    };
    onPlaceholdersChange(updatedPlaceholders);
  };

  const handleSelect = (index: number | null) => {
    setSelectedId(index);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await onTemplateUpload(file);
    }
  };

  const addNewPlaceholder = () => {
    const newPlaceholder: CertificatePlaceholder = {
      key: `placeholder_${placeholders.length + 1}`,
      label: `Placeholder ${placeholders.length + 1}`,
      x: width / 2,
      y: height / 2,
      fontSize: 24,
      color: "#000000",
      fontFamily: "Helvetica",
    };
    onPlaceholdersChange([...placeholders, newPlaceholder]);
    setSelectedId(placeholders.length);
  };

  const removePlaceholder = (index: number) => {
    const updated = [...placeholders];
    updated.splice(index, 1);
    onPlaceholdersChange(updated);
    setSelectedId(null);
  };

  const updatePlaceholderProperty = (
    index: number,
    property: keyof CertificatePlaceholder,
    value: any
  ) => {
    if (index === null) return;

    const updated = [...placeholders];
    updated[index] = {
      ...updated[index],
      [property]: value,
    };
    onPlaceholdersChange(updated);
  };

  return (
    <div className="flex flex-col space-y-6">
      {/* Upload Area */}
      {!templateUrl && (
        <Card className="p-6 border-dashed border-2">
          <CardContent className="pt-6 flex flex-col items-center justify-center text-center min-h-[300px]">
            <div className="mb-4">
              <UploadIcon className="h-12 w-12 text-muted-foreground mb-2" />
              <h3 className="text-lg font-medium">Upload Certificate Template</h3>
              <p className="text-sm text-muted-foreground">
                Upload a PNG, JPG or PDF template for your certificate
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="mt-4"
            >
              <UploadIcon className="mr-2 h-4 w-4" />
              Choose Template
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </CardContent>
        </Card>
      )}

      {/* Canvas Area */}
      {templateUrl && (
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 min-w-0">
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle>Certificate Design</CardTitle>
                  <CardDescription>
                    Drag text elements to position them on your certificate
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    className="border rounded-md overflow-auto"
                    style={{ maxHeight: "600px", maxWidth: "100%" }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        overflow: "auto",
                      }}
                    >
                      <Stage
                        width={width}
                        height={height}
                        ref={stageRef}
                        onClick={(e) => {
                          // Check if clicked on stage but not on a text element
                          if (e.target === e.target.getStage()) {
                            handleSelect(null);
                          }
                        }}
                        style={{
                          backgroundColor: "#f9f9f9",
                        }}
                      >
                        <Layer>
                          {image && (
                            <KonvaImage
                              image={image}
                              width={imageWidth}
                              height={imageHeight}
                              x={(width - imageWidth) / 2}
                              y={(height - imageHeight) / 2}
                            />
                          )}

                          {placeholders.map((placeholder, i) => {
                            const isSelected = selectedId === i;
                            const value = previewData[placeholder.key] || placeholder.label;

                            return (
                              <Group key={i}>
                                {/* Show a highlight around selected text */}
                                {isSelected && (
                                  <Rect
                                    x={placeholder.x - 5}
                                    y={placeholder.y - 5}
                                    width={value.length * placeholder.fontSize * 0.6 + 10}
                                    height={placeholder.fontSize + 10}
                                    opacity={0.3}
                                    fill="#4299e1"
                                  />
                                )}
                                <Text
                                  text={value}
                                  x={placeholder.x}
                                  y={placeholder.y}
                                  fontSize={placeholder.fontSize}
                                  fill={placeholder.color}
                                  fontFamily={placeholder.fontFamily}
                                  draggable
                                  onClick={() => handleSelect(i)}
                                  onTap={() => handleSelect(i)}
                                  onDragStart={() => handlePlaceholderDragStart(i)}
                                  onDragEnd={(e) => handlePlaceholderDragEnd(i, e)}
                                  opacity={placeholder.dragging ? 0.5 : 1}
                                />
                              </Group>
                            );
                          })}
                        </Layer>
                      </Stage>
                    </div>
                  </div>

                  {/* Controls for template */}
                  <div className="flex justify-between mt-4">
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      size="sm"
                    >
                      <UploadIcon className="mr-2 h-4 w-4" />
                      Change Template
                    </Button>
                    <Button
                      variant="outline"
                      onClick={addNewPlaceholder}
                      size="sm"
                    >
                      <PlusIcon className="mr-2 h-4 w-4" />
                      Add Text Field
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Properties Panel */}
            <div className="w-full lg:w-[350px]">
              <Card>
                <CardHeader>
                  <CardTitle>Field Properties</CardTitle>
                  <CardDescription>
                    Customize the selected text element
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedId !== null ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="key">Field Key</Label>
                        <Input
                          id="key"
                          value={placeholders[selectedId]?.key || ""}
                          onChange={(e) =>
                            updatePlaceholderProperty(selectedId, "key", e.target.value)
                          }
                          placeholder="e.g., name, event_name"
                          className="mt-1"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          This key will be used to map data to this field
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="label">Display Label</Label>
                        <Input
                          id="label"
                          value={placeholders[selectedId]?.label || ""}
                          onChange={(e) =>
                            updatePlaceholderProperty(selectedId, "label", e.target.value)
                          }
                          placeholder="Display text"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="fontSize">Font Size</Label>
                        <div className="flex items-center gap-2">
                          <Slider
                            value={[placeholders[selectedId]?.fontSize || 24]}
                            min={8}
                            max={72}
                            step={1}
                            className="flex-1"
                            onValueChange={(values) =>
                              updatePlaceholderProperty(selectedId, "fontSize", values[0])
                            }
                          />
                          <span className="w-10 text-center">
                            {placeholders[selectedId]?.fontSize}
                          </span>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="fontFamily">Font Family</Label>
                        <Select
                          value={placeholders[selectedId]?.fontFamily}
                          onValueChange={(value) =>
                            updatePlaceholderProperty(selectedId, "fontFamily", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select font" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableFonts.map((font) => (
                              <SelectItem key={font} value={font}>
                                {font}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Text Color</Label>
                        <div className="mt-2">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start"
                              >
                                <div
                                  className="h-4 w-4 rounded mr-2"
                                  style={{
                                    backgroundColor: placeholders[selectedId]?.color,
                                  }}
                                />
                                {placeholders[selectedId]?.color}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <HexColorPicker
                                color={placeholders[selectedId]?.color}
                                onChange={(color) =>
                                  updatePlaceholderProperty(selectedId, "color", color)
                                }
                              />
                              <div className="p-2">
                                <Input
                                  value={placeholders[selectedId]?.color}
                                  onChange={(e) =>
                                    updatePlaceholderProperty(
                                      selectedId,
                                      "color",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>

                      <div>
                        <Label>Position</Label>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                          <div>
                            <Label className="text-xs">X</Label>
                            <Input
                              type="number"
                              value={Math.round(placeholders[selectedId]?.x)}
                              onChange={(e) =>
                                updatePlaceholderProperty(
                                  selectedId,
                                  "x",
                                  parseInt(e.target.value) || 0
                                )
                              }
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Y</Label>
                            <Input
                              type="number"
                              value={Math.round(placeholders[selectedId]?.y)}
                              onChange={(e) =>
                                updatePlaceholderProperty(
                                  selectedId,
                                  "y",
                                  parseInt(e.target.value) || 0
                                )
                              }
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-2">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removePlaceholder(selectedId)}
                          className="w-full"
                        >
                          <Trash2Icon className="mr-2 h-4 w-4" />
                          Remove Field
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Select a text element to edit its properties</p>
                      {placeholders.length === 0 && (
                        <Button
                          variant="outline"
                          onClick={addNewPlaceholder}
                          className="mt-4"
                        >
                          <PlusIcon className="mr-2 h-4 w-4" />
                          Add Text Field
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Field list for quick selection */}
              {placeholders.length > 0 && (
                <Card className="mt-4">
                  <CardHeader className="pb-3">
                    <CardTitle>Text Fields</CardTitle>
                    <CardDescription>
                      All text elements on certificate
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {placeholders.map((placeholder, i) => (
                        <div
                          key={i}
                          className={`p-2 rounded-md flex items-center justify-between cursor-pointer ${selectedId === i ? "bg-primary/10" : "hover:bg-muted"
                            }`}
                          onClick={() => handleSelect(i)}
                        >
                          <div className="truncate flex-1">
                            <div className="font-medium">{placeholder.key}</div>
                            <div className="text-xs text-muted-foreground truncate">
                              {placeholder.label}
                            </div>
                          </div>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removePlaceholder(i);
                                }}
                              >
                                <Trash2Icon className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Remove field</TooltipContent>
                          </Tooltip>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,application/pdf"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
