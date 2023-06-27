import React, { useState } from "react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
// import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { highlightPlugin, Trigger } from "@react-pdf-viewer/highlight";
import * as Icon from "react-feather";

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

  const [currentIndex, setcurrentIndex] = useState(-1);
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
  const moveResult = (isNext) => {
    if (areas.length > 0) {
      let currentVal = isNext ? currentIndex + 1 : currentIndex - 1;
      if (currentVal > -1 && currentVal < areas.length) {
        jumpToHighlightArea(areas[currentVal]);
        setcurrentIndex(currentVal);
      }
    }
  };

  return (
    <>
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/legacy/build/pdf.worker.js">
        <div className="pdf-viewer-container">
          <div className="row">
            <div className="col-md-10">
              <div className="all-page-container">
                {fileUrl ? (
                  <>
                    <Viewer
                      fileUrl={fileUrl}
                      plugins={[highlightPluginInstance]}
                    />
                  </>
                ) : (
                  <>
                    <div style={{ paddingTop: "30px" }}>Upload File</div>
                  </>
                )}
              </div>
            </div>

            <div className="col-md-2 right-sidebar">
              <div>
                <ul className="right-sidebar-list">
                  <li
                    className="right-sidebar-list-item active"
                    onClick={() => moveResult(true)}
                  >
                    <Icon.ArrowUpCircle />
                    <span>Next result</span>
                  </li>
                  <li
                    className="right-sidebar-list-item"
                    onClick={() => moveResult(false)}
                  >
                    <Icon.ArrowDownCircle />
                    <span> Prev result</span>
                  </li>
                  <li className="right-sidebar-list-item">
                    <Icon.ZoomIn />
                    <span> Narrow search</span>
                  </li>
                  <li className="right-sidebar-list-item">
                    <Icon.Book />
                    <span>Generate citation</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Worker>
    </>
  );
};

export default Pdf2;
