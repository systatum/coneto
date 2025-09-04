import type { Meta, StoryObj } from "@storybook/react";
import { BoundingBoxesProps, DocumentViewer } from "./document-viewer";
import { ReactElement, useState } from "react";
import { StatefulOnChangeType } from "./stateful-form";
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
    const [tipState, setTipState] = useState<boolean>(false);
    const [activeIndex, setActiveIndex] = useState<number | null>(0);
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
    const [textReview, setTextReview] = useState<string>("");

    const handleSetBoxes = (data?: BoundingBoxesProps) => {
      if (data) {
        setBoundingProcess((prev) => {
          const newBoxes = [...prev, data];
          setActiveIndex(newBoxes.length - 1);
          return newBoxes;
        });
      }
    };

    const handleChangeText = (e: StatefulOnChangeType) => {
      if (activeIndex !== null && e && "target" in e) {
        const { value } = e.target;
        setTextReview(String(value));
      }
    };

    const handleSubmitText = async (data: "cancel" | "submit") => {
      if (data === "submit") {
        await setBoundingProcess((prev) => {
          const newBoxes = [...prev];
          newBoxes[activeIndex] = {
            ...newBoxes[activeIndex],
            contentOnHover: <p>{textReview}</p>,
          };
          setBoundingBoxes(newBoxes);
          return newBoxes;
        });

        await setTextReview("");
        await setActiveIndex(null);
        await setTipState(false);
      } else {
        await setBoundingProcess(boundingBoxes);
        await setTextReview("");
        await setActiveIndex(null);
        await setTipState(false);
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
    );

    return (
      <DocumentViewer
        onRegionSelected={(props: BoundingBoxesProps) => {
          if (!tipState) {
            handleSetBoxes(props);
            setTipState(true);
          }
        }}
        title="Team Collaboration Notes"
        componentRendered={componentRendered}
        showComponentRendered={tipState}
        boundingBoxes={tipState ? boundingProcess : boundingBoxes}
        source="/sample.pdf"
      />
    );
  },
};
