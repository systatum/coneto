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

    const [popupVisibility, setPopupVisibility] = useState<boolean>(false);
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

    /*
     * this is the region that is currently selected, as given by the document viewer;
     * this is needed so that, when we submit the comment, we know at which region
     * should the comment be associated with. remember that once popup comment is
     * called, the process is now asynchronous, that is, user has the time to type whatever
     * comment they write, and so we can't have this data passed as an argument, because
     * the function call will be done before the comment is recorded -- which means, the
     * bounding state is loss and we don't know at which region the comment should be
     * associated. this very state remembered that selection until the comment is submitted
     */
    const [currentlySelectedRegion, setCurrentlySelectedRegion] =
      useState<BoundingBoxState | null>(null);

    const [commentText, setCommentText] = useState<string>("");

    const handleSetBoxes = (data?: BoundingBoxState) => {
      setCurrentlySelectedRegion(data);
      // if the width and height is too small, we ignore it as selection, but to indicate the user may want to ignore/cancel/close the coment popup (if any)
      if (data?.width >= 0.02 || data?.height >= 0.02) {
        setPopupVisibility(true);
      } else {
        setPopupVisibility(false);
      }
    };

    const handleChangeComment = (e: StatefulOnChangeType) => {
      if (e && "target" in e) {
        const { value } = e.target;
        setCommentText(String(value));
      }
    };

    const clearScreen = async () => {
      await setCommentText("");
      await setPopupVisibility(false);
      await ref.current.clearSelection();
      await setCurrentlySelectedRegion(null);
    };

    const handleCancelSubmission = async () => {
      await clearScreen();
    };

    const handleCommentSubmission = async () => {
      await setBoundingBoxes((prev) => {
        const box: BoundingBoxesProps = {
          ...currentlySelectedRegion,
          contentOnHover: <p>{commentText}</p>,
        };
        const newBoxes = [...prev, box];
        return newBoxes;
      });
      await clearScreen();
    };

    useEffect(() => {
      if (!popupVisibility) return;

      let openedAt = Date.now();

      const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const popup = document.getElementById("comment-popup");
        if (!popup?.contains(target)) {
          const elapsed = Date.now() - openedAt;
          if (elapsed < 3000) {
            setPopupVisibility(false);
            setCurrentlySelectedRegion(null);
            setCommentText("");
          }
        }
      };

      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [popupVisibility]);

    const columns: ColumnTableProps[] = [
      {
        id: "page",
        caption: "Page",
        width: "15%",
      },
      {
        id: "x",
        caption: "X",
        width: "15%",
      },
      {
        id: "y",
        caption: "Y",
        width: "15%",
      },
      {
        id: "width",
        caption: "Width",
        width: "15%",
      },
      {
        id: "height",
        caption: "Height",
        width: "15%",
      },
      {
        id: "content",
        caption: "Content",
        width: "25%",
      },
    ];

    const commentPopUp: ReactElement = (
      <ContentViewer
        id="comment-popup"
        ref={ref.current?.repositionPopUp}
        style={{
          left: currentlySelectedRegion?.absoluteX ?? 0,
          top: currentlySelectedRegion?.absoluteY ?? 0,
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
            onChange={handleChangeComment}
            value={commentText}
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
              styles={{ self: { fontSize: "0.75rem" } }}
              onClick={() => handleCancelSubmission()}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              styles={{ self: { fontSize: "0.75rem" } }}
              onClick={() => handleCommentSubmission()}
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
          styles={{
            style: css`
              height: 100vh;
            `,
            dividerStyle: css`
              padding-top: 6px;
              border-bottom: 6px solid #d1d5db;
              background-color: white;
            `,
          }}
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
                  <Table.Row.Cell>{data.contentOnHover}</Table.Row.Cell>
                </Table.Row>
              ))}
            </Table>
          </Window.Cell>
        </Window>
        {popupVisibility && createPortal(commentPopUp, document.body)}
      </>
    );
  },
};

const ContentViewer = styled.div`
  position: absolute;
  border: 2px solid #4daaf5;
  background: rgba(77, 170, 245, 0.2);
`;
