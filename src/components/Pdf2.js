import * as React from "react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
// import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { highlightPlugin, Trigger } from "@react-pdf-viewer/highlight";

// import type {
//   HighlightArea,
//   RenderHighlightsProps,
// } from "@react-pdf-viewer/highlight";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/highlight/lib/styles/index.css";

// interface RenderHighlightAreasExampleProps {
//     areas: HighlightArea[];
//     fileUrl: string;
// }

const Pdf2 = ({ areas, fileUrl }) => {
  //   const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const renderHighlights = (props) => (
    <div
      className="rpv-core__viewer"
      style={{
        border: "1px solid rgba(0, 0, 0, 0.3)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <div
        style={{
          flex: 1,
          overflow: "hidden",
        }}
      >
        <div>
          {areas
            .filter((area) => area.pageIndex === props.pageIndex)
            .map((area, idx) => (
              <div
                key={idx}
                className="highlight-area"
                style={Object.assign(
                  {},
                  {
                    background: "yellow",
                    opacity: 0.4,
                  },
                  props.getCssProperties(area, props.rotation)
                )}
              />
            ))}
        </div>
      </div>
    </div>
  );

  const highlightPluginInstance = highlightPlugin({
    renderHighlights,
    trigger: Trigger.None,
  });
  const { jumpToHighlightArea } = highlightPluginInstance;

  return (
    <>
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/legacy/build/pdf.worker.js">
        <ul
          style={{
            listStyleType: "none",
            marginBottom: "20px",
          }}
        >
          {areas.map((area, index) => (
            <li
              style={{
                padding: "8px",
                margin: "3px",
                cursor: "pointer",
                background: "#fde",
              }}
              key={index}
            >
              <div onClick={() => jumpToHighlightArea(area)}>
                Page : {area.pageIndex}{" "}
              </div>
            </li>
          ))}
        </ul>
        <Viewer fileUrl={fileUrl} plugins={[highlightPluginInstance]} />
      </Worker>
    </>
  );
};

export default Pdf2;
