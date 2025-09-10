import type { Meta, StoryObj } from "@storybook/react";
import {
  BoundingBoxesProps,
  BoundingBoxState,
  DocumentViewerRef,
  DocumentViewer,
} from "./document-viewer";
import { ReactElement, useEffect, useRef, useState } from "react";
import { StatefulOnChangeType } from "./stateful-form";
import { Button } from "./button";
import { Textbox } from "./textbox";
import styled, { css } from "styled-components";
import { Window } from "./window";
import { ColumnTableProps, Table } from "./table";
import { createPortal } from "react-dom";

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
        if (data?.width >= 0.02 || data?.height >= 0.02) {
          setTipState(true);
        } else {
          setTipState(false);
        }
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

    useEffect(() => {
      if (!tipState) return;

      let openedAt = Date.now();

      const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const popup = document.getElementById("comment-popup");
        if (!popup?.contains(target)) {
          const elapsed = Date.now() - openedAt;
          if (elapsed < 3000) {
            setTipState(false);
            setBoundingProcess(null);
            setTextReview("");
          }
        }
      };

      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [tipState]);

    const columns: ColumnTableProps[] = [
      { caption: "Page", width: "15%" },
      { caption: "X", width: "15%" },
      { caption: "Y", width: "15%" },
      { caption: "Width", width: "15%" },
      { caption: "Height", width: "15%" },
      { caption: "Content", width: "25%" },
    ];

    const commentPopUp: ReactElement = (
      <ContentViewer
        id="comment-popup"
        ref={ref.current?.repositionPopUp}
        style={{
          left: boundingProcess?.absoluteX ?? 0,
          top: boundingProcess?.absoluteY ?? 0,
          background: "white",
          border: "1px solid gray",
          zIndex: 9999,
          position: "absolute",
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
        <Window
          orientation="horizontal"
          style={css`
            height: 100vh;
          `}
          dividerStyle={css`
            padding-top: 6px;
            border-bottom: 6px solid #d1d5db;
            background-color: white;
          `}
        >
          <Window.Cell>
            <DocumentViewer
              ref={ref}
              onRegionSelected={(props: BoundingBoxState) => {
                handleSetBoxes(props);
              }}
              title="Team Collaboration Notes"
              boundingBoxes={boundingBoxes}
              source="/sample.pdf"
            />
          </Window.Cell>
          <Window.Cell
            style={css`
              padding-top: 6px;
              background-color: white;
            `}
          >
            <Table columns={columns}>
              {boundingBoxes.map((data, index) => (
                <Table.Row key={index}>
                  <Table.Row.Cell>{data.page}</Table.Row.Cell>
                  <Table.Row.Cell>{data.x.toPrecision(4)}</Table.Row.Cell>
                  <Table.Row.Cell>{data.y.toPrecision(4)}</Table.Row.Cell>
                  <Table.Row.Cell>{data.width.toPrecision(4)}</Table.Row.Cell>
                  <Table.Row.Cell>{data.height.toPrecision(4)}</Table.Row.Cell>
                  <Table.Row.Cell
                    contentStyle={css`
                      display: block;
                      word-break: break-word;
                      white-space: pre-wrap;
                    `}
                  >
                    {data.contentOnHover}
                  </Table.Row.Cell>
                </Table.Row>
              ))}
            </Table>
          </Window.Cell>
        </Window>
        {tipState && createPortal(commentPopUp, document.body)}
      </>
    );
  },
};

const ContentViewer = styled.div`
  position: absolute;
  border: 2px solid #4daaf5;
  background: rgba(77, 170, 245, 0.2);
`;
