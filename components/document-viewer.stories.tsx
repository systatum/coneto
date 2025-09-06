import type { Meta, StoryObj } from "@storybook/react";
import {
  BoundingBoxesProps,
  BoundingBoxState,
  DocumentViewerRef,
  DocumentViewer,
} from "./document-viewer";
import { ReactElement, useRef, useState } from "react";
import { StatefulOnChangeType } from "./stateful-form";
import { Button } from "./button";
import { Textbox } from "./textbox";
import styled from "styled-components";

const meta: Meta<typeof DocumentViewer> = {
  title: "Content/DocumentViewer",
  component: DocumentViewer,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const ref = useRef<DocumentViewerRef>(null);

    const [tipState, setTipState] = useState<boolean>(false);
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
    const [boundingProcess, setBoundingProcess] =
      useState<BoundingBoxState | null>(null);
    const [textReview, setTextReview] = useState<string>("");

    const handleSetBoxes = (data?: BoundingBoxState) => {
      if (data) {
        setBoundingProcess(data);
      }
    };

    const handleChangeText = (e: StatefulOnChangeType) => {
      if (e && "target" in e) {
        const { value } = e.target;
        setTextReview(String(value));
      }
    };

    const handleSubmitText = async (data: "cancel" | "submit") => {
      if (data === "submit") {
        await setBoundingBoxes((prev) => {
          const box: BoundingBoxesProps = {
            ...boundingProcess,
            contentOnHover: <p>{textReview}</p>,
          };
          const newBoxes = [...prev, box];
          return newBoxes;
        });
      }
      await setTextReview("");
      await setTipState(false);
      await ref.current.clearSelection();
      await setBoundingProcess(null);
    };

    const componentRendered: ReactElement = (
      <ContentViewer
        ref={ref.current?.repositionShowPopUp}
        style={{
          left: boundingProcess?.absoluteX ?? 0,
          top: boundingProcess?.absoluteY ?? 0,
          background: "white",
          border: "1px solid gray",
        }}
      >
        <div
          style={{
            background: "white",
            minWidth: 300,
            padding: "12px",
            cursor: "pointer",
          }}
        >
          <Textbox
            name="contentOnHover"
            label="Review"
            autoComplete="off"
            placeholder="Type here..."
            onChange={handleChangeText}
            value={textReview}
          />
          <div
            style={{
              marginTop: 4,
              display: "flex",
              gap: "4px",
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <Button
              style={{ fontSize: "0.75rem" }}
              onClick={() => handleSubmitText("cancel")}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              style={{ fontSize: "0.75rem" }}
              onClick={() => handleSubmitText("submit")}
            >
              Save
            </Button>
          </div>
        </div>
      </ContentViewer>
    );

    return (
      <>
        <DocumentViewer
          ref={ref}
          onRegionSelected={(props: BoundingBoxState) => {
            if (!tipState) {
              handleSetBoxes(props);
              setTipState(true);
            }
          }}
          title="Team Collaboration Notes"
          boundingBoxes={boundingBoxes}
          source="/sample.pdf"
        />
        {tipState && componentRendered}
      </>
    );
  },
};

const ContentViewer = styled.div`
  position: absolute;
  border: 2px solid #4daaf5;
  background: rgba(77, 170, 245, 0.2);
`;
