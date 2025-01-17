import React, { useEffect, useId, useState } from "react";
import Svg, { Path, Text, TextPath, TSpan, Defs } from "react-native-svg";

const isNullOrUndefined = (param: any) => param === undefined || param === null;

const generateEllipsePath = (
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  reversed: boolean
) => {
  const path = `
    M ${cx - rx}, ${cy} 
    a ${rx},${ry} 0 1,0 ${2 * rx},0 
    a ${rx},${ry} 0 1,0 ${-2 * rx},0
  `;
  if (reversed) {
    return `
      M ${cx + rx}, ${cy} 
      a ${rx},${ry} 0 1,1 ${-2 * rx},0 
      a ${rx},${ry} 0 1,1 ${2 * rx},0
    `;
  }
  return path;
};

export default function CurvedText({
  width,
  height,
  cx,
  cy,
  rx,
  ry,
  startOffset = 0,
  reversed = false,
  text,
  svgProps,
  textPathProps,
  textProps,
  tspanProps,
}: {
  width: number;
  height: number;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  startOffset: number;
  reversed: boolean;
  text: string;
  svgProps?: any;
  textPathProps?: any;
  textProps?: any;
  tspanProps?: any;
}) {
  const uniqueId = useId();
  const ellipseId = `ellipse-path-${uniqueId.replaceAll(":", "-")}`;
  const [pathD, setPathD] = useState("");

  useEffect(() => {
    const path = generateEllipsePath(cx, cy, rx, ry, reversed);
    setPathD(path);
  }, [cx, cy, rx, ry, reversed]);

  // Debug: Log the generated path and dimensions
  useEffect(() => {
    console.log("Generated path:", pathD);
    console.log("SVG dimensions:", { width, height });
  }, [pathD, width, height]);

  if (isNullOrUndefined(width)) {
    throw new Error("ReactCurvedText Error: width is required");
  }

  if (isNullOrUndefined(height)) {
    throw new Error("ReactCurvedText Error: height is required");
  }

  if (isNullOrUndefined(cx)) {
    throw new Error("ReactCurvedText Error: cx is required");
  }

  if (isNullOrUndefined(cy)) {
    throw new Error("ReactCurvedText Error: cy is required");
  }

  if (isNullOrUndefined(rx)) {
    throw new Error("ReactCurvedText Error: rx is required");
  }

  if (isNullOrUndefined(ry)) {
    throw new Error("ReactCurvedText Error: ry is required");
  }

  if (isNullOrUndefined(text)) {
    throw new Error("ReactCurvedText Error: text is required");
  }

  return (
    <Svg
      height={Math.max(height, ry * 2)} // Ensure height accommodates the text
      width={Math.max(width, rx * 2)} // Ensure width accommodates the text
      viewBox={`${cx - rx - width / 2} ${cy - ry - height / 2} ${
        rx * 2 + width
      } ${ry * 2 + height}`} // Adjust viewBox for better positioning
      {...svgProps}
    >
      <Defs>
        <Path id={ellipseId} d={pathD} fill="none" />
      </Defs>
      <Text fontWeight={600} {...textProps}>
        <TextPath
          href={`#${ellipseId}`}
          startOffset={`${startOffset}%`} // Ensure offset is percentage
          {...textPathProps}
        >
          <TSpan {...tspanProps}>{text}</TSpan>
        </TextPath>
      </Text>
    </Svg>
  );
}
