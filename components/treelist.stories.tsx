import { Meta, StoryObj } from "@storybook/react";
import {
  SubMenuTreeList,
  TreeList,
  TreeListActionsProps,
  TreeListContentProps,
  TreeListItemsProps,
} from "./treelist";
import {
  RiAtLine,
  RiDeleteBin2Line,
  RiEdit2Line,
  RiFileCopyLine,
  RiSearchLine,
  RiShareForwardLine,
} from "@remixicon/react";
import { EmptySlate } from "./empty-slate";
import { Button } from "./button";
import { css } from "styled-components";
import { useMemo, useState } from "react";
import { Combobox } from "./combobox";
import { OptionsProps } from "./selectbox";

const meta: Meta<typeof TreeList> = {
  title: "Content/TreeList",
  component: TreeList,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof TreeList>;

export const Default: Story = {
  render: () => {
    const setPerson = (item: TreeListItemsProps) => {
      console.log("Clicked person:", item.caption);
    };

    const TREE_LIST_DATA: TreeListContentProps[] = [
      {
        caption: "Member of Technical Staff",
        collapsible: true,
        items: [
          { id: "mts-1", caption: "Adam Noto Hakarsa", onClick: setPerson },
          { id: "mts-2", caption: "Mohamad Naufal Alim", onClick: setPerson },
        ],
      },
      {
        caption: "Product Management Team",
        collapsible: true,
        items: [
          { id: "pmt-1", caption: "Samantha Lee", onClick: setPerson },
          { id: "pmt-2", caption: "Jason Kim", onClick: setPerson },
          { id: "pmt-3", caption: "Rina Patel", onClick: setPerson },
        ],
      },
    ];

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.25rem",
          maxWidth: "250px",
        }}
      >
        <TreeList content={TREE_LIST_DATA} emptySlate={<p>Not found.</p>} />
      </div>
    );
  },
};

export const WithActions: Story = {
  render: () => {
    const setPerson = (item: TreeListItemsProps) => {
      console.log("Clicked person:", item.caption);
    };

    const ITEM_ACTION = (rowId: string): SubMenuTreeList[] => {
      return [
        {
          caption: "Edit",
          icon: RiEdit2Line,
          iconColor: "gray",
          onClick: () => {
            console.log(`${rowId} was edited`);
          },
        },
        {
          caption: "Delete",
          icon: RiDeleteBin2Line,
          iconColor: "gray",
          onClick: () => {
            console.log(`${rowId} was deleted`);
          },
        },
        {
          caption: "Copy",
          icon: RiFileCopyLine,
          iconColor: "gray",
          onClick: () => {
            console.log(`${rowId} was copied`);
          },
        },
        {
          caption: "Share",
          icon: RiShareForwardLine,
          iconColor: "gray",
          onClick: () => {
            console.log(`${rowId} was shared`);
          },
        },
      ];
    };

    const [showItem, setShowItem] = useState({
      actions: ITEM_ACTION,
      length: ["1"],
    });

    const filteredActionsShow = useMemo(() => {
      return (id: string) => {
        const itemActions = showItem.actions(id);
        const itemLength = Number(showItem.length[0]);
        return itemActions.slice(0, itemLength);
      };
    }, [showItem]);

    const TREE_LIST_DATA: TreeListContentProps[] = [
      {
        caption: "Member of Technical Staff",
        items: [
          {
            id: "mts-1",
            caption: "Adam Noto Hakarsa",
            onClick: setPerson,
            actions: filteredActionsShow,
          },
          {
            id: "mts-2",
            caption: "Mohamad Naufal Alim",
            onClick: setPerson,
            actions: filteredActionsShow,
          },
        ],
      },
      {
        caption: "Product Management Team",
        items: [
          {
            id: "pmt-1",
            caption: "Samantha Lee",
            onClick: setPerson,
            actions: filteredActionsShow,
          },
          {
            id: "pmt-2",
            caption: "Jason Kim",
            onClick: setPerson,
            actions: filteredActionsShow,
          },
          {
            id: "pmt-3",
            caption: "Rina Patel",
            onClick: setPerson,
            actions: filteredActionsShow,
          },
        ],
      },
    ];

    const TREE_LIST_ACTIONS: TreeListActionsProps[] = [
      {
        caption: "Discover",
        onClick: () => {
          console.log("Discover clicked");
        },
        icon: RiSearchLine,
      },
      {
        caption: "Mention",
        onClick: () => {
          console.log("Mention clicked");
        },
        icon: RiAtLine,
      },
    ];

    const SHOW_OPTIONS: OptionsProps[] = [
      { text: "1", value: "1" },
      { text: "2", value: "2" },
      { text: "3", value: "3" },
      { text: "4", value: "4" },
    ];

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.25rem",
          maxWidth: "300px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "4px",
            paddingLeft: "20px",
          }}
        >
          Subitem actions:
          <Combobox
            options={SHOW_OPTIONS}
            selectedOptions={showItem.length}
            setSelectedOptions={(e: string[]) =>
              setShowItem((prev) => ({ ...prev, length: e }))
            }
            containerStyle={css`
              width: 30%;
            `}
          />
        </div>
        <TreeList
          key={Number(showItem.length[0])}
          content={TREE_LIST_DATA}
          actions={TREE_LIST_ACTIONS}
          emptySlate={<p>Not found.</p>}
        />
      </div>
    );
  },
};

export const WithoutHeader: Story = {
  render: () => {
    const setPerson = (item: TreeListItemsProps) => {
      console.log("Clicked person:", item.caption);
    };

    const TREE_LIST_DATA = [
      {
        items: [
          { id: "1", caption: "Adam Noto Hakarsa", onClick: setPerson },
          { id: "2", caption: "Mohamad Naufal Alim", onClick: setPerson },
          { id: "3", caption: "Samantha Lee", onClick: setPerson },
          { id: "4", caption: "Jason Kim", onClick: setPerson },
          { id: "5", caption: "Rina Patel", onClick: setPerson },
        ],
      },
    ];

    const TREE_LIST_ACTIONS: TreeListActionsProps[] = [
      {
        caption: "Discover",
        onClick: () => {
          console.log("Discover clicked");
        },
        icon: RiSearchLine,
      },
      {
        caption: "Mention",
        onClick: () => {
          console.log("Mention clicked");
        },
        icon: RiAtLine,
      },
    ];

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.25rem",
          maxWidth: "250px",
        }}
      >
        <TreeList
          content={TREE_LIST_DATA}
          actions={TREE_LIST_ACTIONS}
          emptySlate={<p>Not found.</p>}
        />
      </div>
    );
  },
};

export const WithEmptySlate: Story = {
  render: () => {
    const TREE_LIST_DATA: TreeListContentProps[] = [];

    const TREE_LIST_ACTIONS: TreeListActionsProps[] = [
      {
        caption: "Discover",
        onClick: () => {
          console.log("Discover clicked");
        },
        icon: RiSearchLine,
      },
      {
        caption: "Mention",
        onClick: () => {
          console.log("Mention clicked");
        },
        icon: RiAtLine,
      },
    ];

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.25rem",
          maxWidth: "250px",
        }}
      >
        <TreeList
          content={TREE_LIST_DATA}
          actions={TREE_LIST_ACTIONS}
          emptySlate={
            <EmptySlate
              imageUrl="https://picsum.photos/200?random=1"
              title="Manage your inventory transfers"
              containerStyle={css`
                text-align: center;
                margin: auto;
              `}
              imageStyle={css`
                max-width: 200px;
              `}
              subtitle="Track and receive your incoming inventory from suppliers."
              actions={
                <>
                  <Button
                    variant="default"
                    style={{
                      fontSize: "12px",
                    }}
                  >
                    Add Item
                  </Button>
                  <Button
                    variant="primary"
                    style={{
                      fontSize: "12px",
                    }}
                  >
                    Learn More
                  </Button>
                </>
              }
            />
          }
        />
      </div>
    );
  },
};
