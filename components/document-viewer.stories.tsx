import type { Meta, StoryObj } from "@storybook/react";
import { BoundingBoxesProps, DocumentViewer } from "./document-viewer";
import { css } from "styled-components";
import { ReactElement, useState } from "react";
import { StatefulForm } from "./stateful-form";
import { Button } from "./button";
import { Textbox } from "./textbox";

const meta: Meta<typeof DocumentViewer> = {
  title: "Content/DocumentViewer",
  component: DocumentViewer,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [tipState, setTipState] = useState<
      "succeed" | "failed" | "idle" | "process"
    >("idle");
    const [boundingBoxes, setBoundingBoxes] = useState<BoundingBoxesProps[]>([
      {
        page: 1,
        x: 0.1319796954314721,
        y: 0.32014388489208634,
        width: 0.751269035532995,
        height: 0.34532374100719426,
        contentOnHover: <p>heyyy</p>,
        boxStyle: { borderColor: "#aqua", backgroundColor: "#aqua" },
      },
    ]);

    const [boundingProcess, setBoundingProcess] = useState(boundingBoxes);

    const handleSetBoxes = (data: BoundingBoxesProps) => {
      if (tipState === "idle") {
        setBoundingProcess((prev) => [...prev, data]);
      }
    };

    const componentRendered: ReactElement = (
      <div
        style={{
          background: "white",
          minWidth: 300,
          padding: "8px 8px 4px",
          cursor: "pointer",
        }}
      >
        <Textbox
          name="input"
          label="Input"
          placeholder="Type here..."
          onChange={() => setBoundingProcess((prev) => [...prev])}
        />
        <div
          style={{
            marginTop: 4,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button style={{ fontSize: "0.75rem" }}>Save</Button>
        </div>
      </div>
    );

    return (
      <DocumentViewer
        onRegionSelected={(props: BoundingBoxesProps) => {
          setTipState("process");
          handleSetBoxes(props);
        }}
        componentRendered={componentRendered}
        showComponentRendered={tipState === "process"}
        boundingBoxes={
          tipState === "succeed" || tipState === "failed"
            ? boundingBoxes
            : boundingProcess
        }
        source="/sample.pdf"
      />
    );
  },
};
